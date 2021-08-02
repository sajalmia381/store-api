import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { REFRESH_KEY } from '../config';
import { User } from '../models';
import CustomErrorHandler from '../services/CustomErrorHandler';
import JwtService from '../services/JwtService';

const authController = {
  login: (req: Request, res: Response, next: NextFunction) => {
    res.sendStatus(200);
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
        return next(CustomErrorHandler.alreadyExists('This email is already taken'))
      }
    } catch (err) {
      return next(err)
    }
    
    // create user
    // console.log('Create user')
    const userPayload = {
      name: formData.name,
      email: formData.email,
      number: formData.number,
      password: formData.password
    }
    try {
      const user = await User.create(userPayload);
      const payload = {
        name: user.name,
        email: user.email,
        role: user.role,
        number: user.number
      }
      const access_token = JwtService.sign(payload);
      const refresh_token = JwtService.sign(payload, '1y', REFRESH_KEY);
      res.status(201).json({status: 201, message: 'User Created', access_token, refresh_token})
    } catch (err) {
      return next(CustomErrorHandler.serverError(err.message))
    }
  }
}

export default authController;