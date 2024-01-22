import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { User } from '../models';
import { UserDocument } from '../models/user.model';
import CustomErrorHandler from '../services/CustomErrorHandler';

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
      if (isExists) {
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
      if (req?.isSuperAdmin) {
        await user.save();
        return res.status(201).json({status: 201, message: 'Success! User created by admin', data: user})
      }
      res.status(201).json({status: 201, message: 'Success! User created', data: user})
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
      return res.json({ status: 200, message: 'Success: User description.', data: user })
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
      const isExists: boolean = await User.exists({_id: req.params.id});
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
        return res.status(202).json({status: 202, message: 'Success! User updated by admin', data })
      }
      const user = await User.findOne({ _id: req.params.id }) as UserDocument;
      const data = {
        name: user.name,
        email: user.email,
        number: user.number,
        role: user.role,
        ...userPayload
      }
      return res.status(202).json({status: 202, message: 'Success! User updated', data})
    } catch (err: any) {
      return next(CustomErrorHandler.serverError(err?.message))
    }
  },
  destroy: async (req: Request, res: Response, next: NextFunction) => {
   try {
    if(req?.isSuperAdmin) {
      const instance = await User.findOneAndDelete({_id: req.params.id})
      if (!instance) {
        return next(CustomErrorHandler.notFound('User is not found!'))
      }
      return res.status(202).json({status: 202, message: 'Success! User deleted by admin'})
    }
    const instance = await User.find({_id: req.params.id})
    if (!instance) {
      return next(CustomErrorHandler.notFound('User is not found!'))
    }
    return res.status(202).json({status: 202, message: 'Success! User deleted'})
   } catch (err: any) {
     return next(CustomErrorHandler.serverError(err?.message))
   }
  }
}

export default userController;