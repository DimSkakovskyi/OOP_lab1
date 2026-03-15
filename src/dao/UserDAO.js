const pool = require('../db');

class UserDAO {

  static async findByLogin(login) {

    const result = await pool.query(
      'SELECT * FROM users WHERE login = $1',
      [login]
    );

    return result.rows[0];
  }
}

module.exports = UserDAO;