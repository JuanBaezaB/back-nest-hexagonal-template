import * as Joi from 'joi';
import { Environment } from '../types/environment.type';

export const environmentSchema = Joi.object<Environment, true>({
  ENVIRONMENT: Joi.string()
    .valid('development', 'production')
    .default('development'),
  PORT: Joi.number().default(3001),
  LOG_LEVEL: Joi.string().default('info'),
  DATABASE_HOST: Joi.string().required(),
  DATABASE_PORT: Joi.number().required(),
  DATABASE_USER: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_NAME: Joi.string().required(),
  DATABASE_SCHEMA: Joi.string().required(),
  JWT_ACCESS_SECRET: Joi.string().required(),
  JWT_ACCESS_EXPIRATION: Joi.string().default('15m'),
  JWT_REFRESH_SECRET: Joi.string().required(),
  JWT_REFRESH_EXPIRATION: Joi.string().default('7d'),
  JWT_ISSUER: Joi.string().required(),
});
