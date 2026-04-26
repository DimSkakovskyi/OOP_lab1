import 'reflect-metadata';
import { AppDataSource } from '../config/data-source';
import { User } from '../entities/User';
import { hashPassword } from '../utils/password';

async function main() {
  await AppDataSource.initialize();

  const userRepository = AppDataSource.getRepository(User);

  const existingAdmin = await userRepository.findOne({
    where: { login: 'admin1' },
  });

  if (existingAdmin) {
    console.log('Admin already exists');
    await AppDataSource.destroy();
    return;
  }

  const hashedPassword = await hashPassword('admin123');

  const admin = userRepository.create({
    login: 'admin1',
    password: hashedPassword,
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