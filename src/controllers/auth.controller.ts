import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { JwtPayload } from 'jsonwebtoken';
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
      const user = await User.findOne({email: req.body.email}).select("-updateAt -__v");
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
      const access_token = JwtService.sign(payload);
      const refresh_token = JwtService.sign(payload, '30d', REFRESH_KEY)
      if(user?.role === "ROLE_SUPER_ADMIN") {
        await RefreshToken.create({ token: refresh_token });
      }
      res.json({access_token, refresh_token, data: user, message: 'Sign in success', status: 200 })
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
      const access_token = JwtService.sign(payload);
      const refresh_token = JwtService.sign(payload, '1y', REFRESH_KEY);
      res.status(201).json({status: 201, message: 'User created', access_token, refresh_token})
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
      const refreshTokenObj = await RefreshToken.findOne({ token: req.body.refresh_token });
      console.log('refreshToken', refreshTokenObj)
      if (!refreshTokenObj) {
        return next(CustomErrorHandler.unAuthorization('Invalid, Token is not found'))
      }
      let userId;
      try {
        const { _id } = JwtService.verify(refreshTokenObj.token, REFRESH_KEY) as JwtPayload;
        userId = _id
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
      const access_token = JwtService.sign(payload);
      const refresh_token = JwtService.sign(payload, '30d', REFRESH_KEY)
      if (req?.isSuperAdmin) {
        await RefreshToken.create({token: refresh_token})
      }
      res.status(201).json({ access_token, refresh_token, user })
    } catch (err) {
      return next(CustomErrorHandler.serverError())
    }
  }
}

export default authController;