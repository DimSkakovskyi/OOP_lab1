import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { env } from './env';
import { User } from '../entities/User';
import { Account } from '../entities/Account';
import { Card } from '../entities/Card';
import { Payment } from '../entities/Payment';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: env.dbHost,
  port: env.dbPort,
  username: env.dbUsername,
  password: env.dbPassword,
  database: env.dbName,
  synchronize: false,
  logging: false,
  entities: [User, Account, Card, Payment],
  migrations: ['src/migrations/*.ts'],
});