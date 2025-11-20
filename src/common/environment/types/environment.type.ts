export type Environment = Readonly<{
  ENVIRONMENT: 'development' | 'production';
  PORT: number;
  LOG_LEVEL: string;

  USERS_DATABASE_HOST: string;
  USERS_DATABASE_NAME: string;
  USERS_DATABASE_PORT: number;
  USERS_DATABASE_USER: string;
  USERS_DATABASE_PASSWORD: string;
  USERS_DATABASE_SCHEMA: string;

  TASKS_DATABASE_HOST: string;
  TASKS_DATABASE_NAME: string;
  TASKS_DATABASE_PORT: number;
  TASKS_DATABASE_USER: string;
  TASKS_DATABASE_PASSWORD: string;
  TASKS_DATABASE_SCHEMA: string;
}>;
