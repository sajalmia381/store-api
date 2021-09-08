import { Request, Response, NextFunction, json } from 'express';
import Joi from 'joi';
import { REFRESH_KEY } from '../config';
import { User } from '../models';
import { UserDocument } from '../models/user.model';
import CustomErrorHandler from '../services/CustomErrorHandler';
import JwtService from '../services/JwtService';

const userController = {
  list: async (req: Request, res: Response, next: NextFunction) => {
    let users: any = []
    try {
      if (req?.isSuperAdmin) {
        users = await User.find().select('-__v');
      } else {
        users = await User.find({role: 'ROLE_CUSTOMER'}).select('-__v');
      }
      return res.json({ status: 200, message: 'Success', data: users })
    } catch (err) {
      return next(CustomErrorHandler.serverError())
    }
  },
  create: async (req: Request, res: Response, next: NextFunction) => {
    const userSchema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      number: Joi.string(),
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
      if(req?.isSuperAdmin) {
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
    } catch (err: any) {
      return next(CustomErrorHandler.serverError(err.message))
    }
    
  },
  description: async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    let user: any = {}
    try {
      if (req?.isSuperAdmin) {
        user = await User.findOne({'_id': id}).select('-__v');
      } else {
        user = await User.findOne({'_id': id, role: 'ROLE_CUSTOMER'}).select('-__v');
      }
      if (!user) {
        return next(CustomErrorHandler.notFound())
      }
      return res.json({ status: 200, message: 'Success', data: user })
    } catch (err) {
      return next(CustomErrorHandler.notFound())
    }
  },
  update: async (req: Request, res: Response, next: NextFunction) => {
    const userSchema = Joi.object({
      name: Joi.string().required(),
      number: Joi.number(),
    })
    const formData = req.body;
    const { error } = userSchema.validate(formData);
    if (error) {
      return next(error)
    }
    
    // Check user exists
    // console.log('Checking user is exists')
    try {
      const isExists: boolean = await User.exists({email: req.params.id});
      if(!isExists) {
        return res.status(404).json({status: 404, message: 'User is not found!'})
      }
    } catch (err) {
      return next(err)
    }
    
    // Create user
    // console.log('Create user')
    const userPayload = {
      ...(formData.name && {name: formData.name}),
      ...(formData.number && {number: formData.number})
    }
    try {
      if(req?.isSuperAdmin) {
        const data = await User.findOneAndUpdate({_id: req.params.id}, userPayload, { new: true, useFindAndModify: false });
        return res.status(201).json({status: 201, message: 'User updated by admin', data })
      }
      const user = await User.findOne({ _id: req.params.id }) as UserDocument;
      const data = {
        name: user.name,
        email: user.email,
        number: user.number,
        role: user.role,
        ...userPayload
      }
      return res.status(201).json({status: 201, message: 'Updated', data})
    } catch (err: any) {
      return next(CustomErrorHandler.serverError(err.message))
    }
  },
  destroy: async (req: Request, res: Response, next: NextFunction) => {
   try {
    if(req?.isSuperAdmin) {
      const instance = await User.findOneAndDelete({_id: req.params.id})
      if (!instance) {
        return next(CustomErrorHandler.notFound('User is not found!'))
      }
    } else {
      const instance = await User.find({_id: req.params.id})
      if (!instance) {
        return next(CustomErrorHandler.notFound('User is not found!'))
      }
    }
   } catch (err) {
     return next(CustomErrorHandler.notFound('User is not found!'))
   }
    return res.json({status: 202, message: 'Success! User deleted'})
  }
}

export default userController;