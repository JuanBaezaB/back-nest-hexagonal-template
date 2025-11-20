import * as Joi from 'joi';
import { Environment } from '../types/environment.type';

export const environmentSchema = Joi.object<Environment, true>({
  ENVIRONMENT: Joi.string()
    .valid('development', 'production')
    .default('development'),
  PORT: Joi.number().default(3001),
  LOG_LEVEL: Joi.string().default('info'),
  USERS_DATABASE_HOST: Joi.string().required(),
  USERS_DATABASE_PORT: Joi.number().required(),
  USERS_DATABASE_NAME: Joi.string().required(),
  USERS_DATABASE_USER: Joi.string().required(),
  USERS_DATABASE_PASSWORD: Joi.string().required(),
  USERS_DATABASE_SCHEMA: Joi.string().required(),

  TASKS_DATABASE_HOST: Joi.string().required(),
  TASKS_DATABASE_PORT: Joi.number().required(),
  TASKS_DATABASE_NAME: Joi.string().required(),
  TASKS_DATABASE_USER: Joi.string().required(),
  TASKS_DATABASE_PASSWORD: Joi.string().required(),
  TASKS_DATABASE_SCHEMA: Joi.string().required(),
});
