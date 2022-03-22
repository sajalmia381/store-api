import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { JwtPayload } from 'jsonwebtoken';
import Utils from '../services/Utils';
import { REFRESH_KEY } from '../config';
import { RefreshToken, User } from '../models';
import CustomErrorHandler from '../services/CustomErrorHandler';
import JwtService from '../services/JwtService';

interface JWTPayload {
  _id: string;
  name: string;
  email: string,
  role: string
}

const authController = {
  login: async (req: Request, res: Response, next: NextFunction) => {
    // Request validation
    const loginSchema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required()
    })
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return next(error)
    }
    // Start database query
    try {
      const user = await User.findOne({email: req.body.email}).select("-updatedAt -__v");
      if (!user) {
        return next(CustomErrorHandler.badRequest('User is not found'));
      }
      // Check password
      const isPasswordMatch = await user.comparePassword(req.body.password);
      if (!isPasswordMatch) {
        return next(CustomErrorHandler.badRequest('Your password is wrong'));
      }
      // Generate token
      const payload: JWTPayload = {
        _id: user._id,
        name: user.name,
        role: user.role,
        email: user.email
      }
      const tokenValidity: any = req.query?.duration;
      const refreshTokenValidity: any = req.query?.refreshDuration
      const [access_token, refresh_token] = JwtService.generateJWTTokens(payload, tokenValidity, refreshTokenValidity);
      if(user?.role === "ROLE_SUPER_ADMIN") {
        await RefreshToken.create({ token: refresh_token });
      }
      user.updateLogin();
      res.json({data: { access_token, refresh_token }, message: 'Sign in success', status: 200 })
      res.end();
    } catch (err) {
      return next(err)
    }
  },
  register: async (req: Request, res: Response, next: NextFunction) => {
    const formData = req.body;
    const registerSchema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      number: Joi.number(),
      password: Joi.string().required(),
      password_repeat: Joi.ref('password'),
    })
    
    const { error } = registerSchema.validate(formData);
    if (error) {
      return next(error)
    }
    
    // Check user exists
    // console.log('Checking user is exists')
    try {
      const isExists: boolean = await User.exists({email: formData.email});
      if(isExists) {
        return next(CustomErrorHandler.alreadyExists('User exists! This email is taken'))
      }
    } catch (err) {
      return next(err)
    }
    
    // Create user
    // console.log('Create user')
    const userPayload = {
      name: formData.name,
      email: formData.email,
      number: formData.number,
      password: formData.password
    }
    try {
      let user = new User(userPayload);
      // const user = await User.create(userPayload);
      if (req?.isSuperAdmin) {
        user = await user.save(); 
      }
      const payload: JWTPayload = {
        _id: user._id,
        name: user.name,
        role: user.role,
        email: user.email
      }
      const access_token = JwtService.sign(payload, '15m');
      const refresh_token = JwtService.sign(payload, '7d', REFRESH_KEY)
      res.status(201).json({status: 201, message: 'User created', data: { access_token, refresh_token }})
    } catch (err: any) {
      return next(CustomErrorHandler.serverError(err.message))
    }
  },
  refreshToken: async (req: Request, res: Response, next: NextFunction) => {
    const tokenSchema = Joi.object({
      refresh_token: Joi.string().required()
    })
    const { error } = tokenSchema.validate(req.body);
    if (error) {
      return next(error)
    }
    try {
      const body_refresh_token = req.body.refresh_token
      let userId;
      try {
        const { data } = JwtService.verify(body_refresh_token, REFRESH_KEY) as JwtPayload;
        userId = data?._id
      } catch (err) {
        return next(CustomErrorHandler.unAuthorization('Invalid refresh token'))
      }
      
      const user = await User.findOne({_id: userId }).select("-password -updatedAt -__v")
      
      if (!user) {
        return next(CustomErrorHandler.unAuthorization('No user found!'))
      }
      const payload: JWTPayload = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
      const tokenValidity: any = req.query?.duration;
      const refreshTokenValidity: any = req.query?.refreshDuration;
      const [access_token, refresh_token] = JwtService.generateJWTTokens(payload, tokenValidity, refreshTokenValidity);
      if (req?.isSuperAdmin) {
        const refreshTokenObj = await RefreshToken.findOne({ token: body_refresh_token });
        if (!refreshTokenObj) {
          return next(CustomErrorHandler.unAuthorization('Invalid, Token is not found'))
        }
        await RefreshToken.deleteOne({token: body_refresh_token})
        await RefreshToken.create({token: refresh_token})
      }
      user.updateLogin();
      res.status(201).json({ status: 201, message: 'Success! New tokens created', data: { access_token, refresh_token }})
    } catch (err) {
      return next(CustomErrorHandler.serverError())
    }
  }
}

export default authController;