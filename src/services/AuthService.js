const bcrypt = require('bcrypt');
const UserDAO = require('../dao/UserDAO');

class AuthService {
  static async login(login, plainPassword) {
    const user = await UserDAO.findByLogin(login);

    if (!user) {
      throw new Error('Invalid login or password');
    }

    const isPasswordValid = await bcrypt.compare(plainPassword, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid login or password');
    }

    return {
      id: user.id,
      login: user.login,
      role: user.role,
    };
  }

  static async register(login, plainPassword, role = 'CLIENT') {
    const existingUser = await UserDAO.findByLogin(login);

    if (existingUser) {
      throw new Error('User with this login already exists');
    }

    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    return UserDAO.create(login, hashedPassword, role);
  }

  static async getUserById(id) {
    const user = await UserDAO.findById(id);

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }
}

module.exports = AuthService;