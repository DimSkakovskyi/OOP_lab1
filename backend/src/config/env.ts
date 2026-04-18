import dotenv from 'dotenv';
dotenv.config();

function getEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

export const env = {
  port: Number(process.env.PORT) || 5000,
  dbHost: getEnv('DB_HOST'),
  dbPort: Number(getEnv('DB_PORT')),
  dbUsername: getEnv('DB_USERNAME'),
  dbPassword: getEnv('DB_PASSWORD'),
  dbName: getEnv('DB_NAME'),
  jwtSecret: getEnv('JWT_SECRET'),
  jwtExpiresIn: getEnv('JWT_EXPIRES_IN'),
};