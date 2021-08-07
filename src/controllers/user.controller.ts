import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { REFRESH_KEY } from '../config';
import { User } from '../models';
import CustomErrorHandler from '../services/CustomErrorHandler';
import JwtService from '../services/JwtService';

const userController = {
  userList: async (req: Request, res: Response, next: NextFunction) => {
    let users: any = []
    try {
      if (req?.isSuperAdmin) {
        users = await User.find().select('-__v');
      } else {
        users = await User.find({role: 'ROLE_CUSTOMER'}).select('-__v');
      }
      return res.json({ status: 200, message: 'Success', date: users })
    } catch (err) {
      return next(CustomErrorHandler.serverError())
    }
  },
  userCreate: async (req: Request, res: Response, next: NextFunction) => {
    const userSchema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      number: Joi.number(),
      password: Joi.string().min(6).required(),
      password_repeat: Joi.ref('password')
    })
    const formData = req.body;
    const { error } = userSchema.validate(formData);
    if (error) {
      return next(error)
    }
    
    // Check user exists
    // console.log('Checking user is exists')
    try {
      const isExists: boolean = await User.exists({email: formData.email});
      if(isExists) {
        return next(CustomErrorHandler.alreadyExists('This email is taken'))
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
    const user = new User(userPayload);
    try {
      if(req.isSuperAdmin) {
        await user.save();
      }
      const tokenPayload = {
        name: user.name,
        email: user.email,
        role: user.role
      }
      const access_token = JwtService.sign(tokenPayload);
      const refresh_token = JwtService.sign(tokenPayload, '1y', REFRESH_KEY);
      res.status(201).json({status: 201, message: 'User created', access_token, refresh_token})
    } catch (err) {
      return next(CustomErrorHandler.serverError(err.message))
    }
    
  },
  userDescription: async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    let user: any = []
    try {
      if (req?.isSuperAdmin) {
        user = await User.findOne({'_id': id}).select('-__v');
      } else {
        user = await User.findOne({'_id': id, role: 'ROLE_CUSTOMER'}).select('-__v');
      }
      if (!user) {
        return next(CustomErrorHandler.notFound())
      }
      return res.json({ status: 200, message: 'Success', date: user })
    } catch (err) {
      return next(CustomErrorHandler.notFound())
    }
  },
  userUpdate: async (req: Request, res: Response, next: NextFunction) => {
    const userSchema = Joi.object({
      name: Joi.string().required(),
      number: Joi.number()
    })
    
    const formData = req.body;
    const { error } = userSchema.validate(formData);
    if (error) {
      return next(error)
    }
    
    // Check user exists
    // console.log('Checking user is exists')
    try {
      const isExists: boolean = await User.exists({email: formData.email});
      if(isExists) {
        return next(CustomErrorHandler.alreadyExists('This email is taken'))
      }
    } catch (err) {
      return next(err)
    }
    
    // Create user
    // console.log('Create user')
    const userPayload = {
      name: formData.name,
      number: formData.number
    }
    let data;
    try {
      if(req.isSuperAdmin) {
        data = await User.findOneAndUpdate({_id: req.params.id}, userPayload, { new: true });
      } else {
        data = await User.find({_id: req.params.id});
      }
      res.status(201).json({status: 201, message: 'Updated', data})
    } catch (err) {
      return next(CustomErrorHandler.serverError(err.message))
    }
  },
}

export default userController;