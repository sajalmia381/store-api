import { NextFunction, Request, Response } from "express";
import { Todo } from "../models";
import Joi from "joi";


const todoController = {
  list: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const todos = await Todo.find().select("-__v");
      res.json({ data: todos, status: 200, message: "Success! Todo List" });
    } catch (err) {
      return next(err);
    }
  },
  create: async (req: Request, res: Response, next: NextFunction) => {
    const todoSchema = Joi.object({
      title: Joi.string().required(),
      completed: Joi.boolean().required(),
    });
    const { error } = todoSchema.validate(req.body);
    if (error) return next(error);

    const obj = new Todo({
      title: req.body.title,
      completed: req.body.completed,
      createdBy: req?.user?._id || '612e4959345dcc333ac6cb35' // Sajalmia
    });

    try {
      if (req.isSuperAdmin) {
        const todo = await obj.save();
        return res.json({
          status: 201,
          data: todo,
          message: "Success! Todo created by Admin",
        });
      }
      // Fake Response
      const todo = {
        _id: obj._id,
        title: obj.title,
        completed: obj.completed,
        createdBy: req?.user?._id || '612e4959345dcc333ac6cb35' // Sajalmia
      };
      return res.json({
        data: todo,
        status: 201,
        message: "Success! Todo created",
      });
    } catch (err) {
      return next(err);
    }
  },
};

export default todoController;
