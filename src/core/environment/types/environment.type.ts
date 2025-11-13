export type Environment = Readonly<{
  ENVIRONMENT: 'development' | 'production';
  PORT: number;
  LOG_LEVEL: string;
  DATABASE_HOST: string;
  DATABASE_PORT: number;
  DATABASE_USER: string;
  DATABASE_PASSWORD: string;
  DATABASE_NAME: string;
  DATABASE_SCHEMA: string;
}>;
