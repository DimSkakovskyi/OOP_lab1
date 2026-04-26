import 'reflect-metadata';
import crypto from 'crypto';
import { AppDataSource } from '../config/data-source';
import { User } from '../entities/User';
import { hashPassword } from '../utils/password';

function hashPasswordLikeFrontend(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

async function main() {
  await AppDataSource.initialize();

  const userRepository = AppDataSource.getRepository(User);

  const frontendHashedPassword = hashPasswordLikeFrontend('admin123');
  const backendHashedPassword = await hashPassword(frontendHashedPassword);

  const existingAdmin = await userRepository.findOne({
    where: { login: 'admin1' },
  });

  if (existingAdmin) {
    existingAdmin.password = backendHashedPassword;
    existingAdmin.role = 'ADMIN';

    await userRepository.save(existingAdmin);

    console.log('Admin already existed, password updated');
    await AppDataSource.destroy();
    return;
  }

  const admin = userRepository.create({
    login: 'admin1',
    password: backendHashedPassword,
    role: 'ADMIN',
  });

  await userRepository.save(admin);

  console.log('Initial admin created');
  await AppDataSource.destroy();
}

main().catch(async (error) => {
  console.error(error);
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
});