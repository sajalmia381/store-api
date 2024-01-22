import { NextFunction, Request, Response } from "express";
import { Todo, isCompleteStatus } from "../models";
import Joi from "joi";
import CustomErrorHandler from "../services/CustomErrorHandler";
import { TodoDocument } from "src/models/todo.model";

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
      status: Joi.string(),
      description: Joi.string(),
    });
    const { error } = todoSchema.validate(req.body);
    if (error) return next(error);

    const { title, status, description } = req.body;

    const obj = new Todo({
      title: title,
      completed: isCompleteStatus(status) ? true : false,
      status: status || "TODO",
      description: description || "",
      createdBy: req?.user?._id || "612e4959345dcc333ac6cb35", // Sajalmia
    });

    try {
      if (req.isSuperAdmin) {
        const todo = await obj.save();
        return res.status(201).json({
          status: 201,
          data: todo,
          message: "Success! Todo created by admin",
        });
      }
      // Fake Response
      const todo = {
        _id: obj._id,
        title: obj.title,
        completed: obj.completed,
        status: obj.status,
        description: obj.description,
        createdBy: req?.user?._id || "612e4959345dcc333ac6cb35", // Sajalmia
      };
      return res.status(201).json({
        data: todo,
        status: 201,
        message: "Success! Todo created",
      });
    } catch (err) {
      return next(err);
    }
  },
  update: async (req: Request, res: Response, next: NextFunction) => {
    const todoSchema = Joi.object({
      status: Joi.string().valid(),
      description: Joi.string(),
    });
    const { error } = todoSchema.validate(req.body);
    if (error) return next(error);

    const { status, description } = req.body;

    if (!status && !description)
      return next(CustomErrorHandler.badRequest("ERROR: Input is invalid."));

    const payload: any = { $set: {} };
    if (status) payload["$set"]["status"] = status;
    if (description) payload["$set"]["description"] = description;

    try {
      if (req.isSuperAdmin) {
        const todo = await Todo.findOneAndUpdate(
          { _id: req.params.id },
          payload,
          { new: true, useFindAndModify: true }
        );
        return res.status(202).json({
          status: 202,
          data: todo,
          message: "Success! Todo update by Admin",
        });
      }
      // Fake Response
      const _todo = await Todo.findOne({ _id: req.params.id }) as TodoDocument;

			if (!_todo) {
				return res.status(406).json({ status: 406, message: 'Todo is not found!' })
			}

			if (!req?.isSuperAdmin) {
				const todo = {
					"_id": req.params.id,
					"title": _todo.title,
					"status": _todo.status,
					"description": _todo.description,
          "completed": isCompleteStatus(status) ? true : _todo.completed,
					"createdAt": _todo.createdAt,
          "updatedAt": _todo.updatedAt,
					...req.body
				}
				return res.status(202).json({ data: todo, status: 202, message: 'Success! todo updated' })
			}
    } catch (err) {
      return next(err);
    }
  },
  destroy: async (req: Request, res: Response, next: NextFunction) => {
    try {
			if (!req?.isSuperAdmin) {
				const instance = await Todo.findOne({ _id: req.params.id })
				if (!instance) {
					return next(CustomErrorHandler.notFound('Todo is not found!'))
				}
				return res.status(202).json({ status: 202, message: 'Success! Todo deleted' })
			}
			const instance = await Todo.findOneAndDelete({ _id: req.params.id })
			if (!instance) {
				return next(CustomErrorHandler.notFound('Todo is not found!'))
			}
			return res.status(202).json({ status: 202, message: 'Success! Todo deleted by Admin' });
		} catch (err) {
			return next(CustomErrorHandler.serverError())
		}
  },
};

export default todoController;
