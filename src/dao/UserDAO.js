const pool = require('../config/db');

class UserDAO {
  static async create(login, password, role) {
    const result = await pool.query(
      `INSERT INTO users (login, password, role)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [login, password, role]
    );

    return result.rows[0];
  }

  static async findById(id) {
    const result = await pool.query(
      `SELECT * FROM users
       WHERE id = $1`,
      [id]
    );

    return result.rows[0];
  }

  static async findByLogin(login) {
    const result = await pool.query(
      `SELECT * FROM users
       WHERE login = $1`,
      [login]
    );

    return result.rows[0];
  }

  static async findAll() {
    const result = await pool.query(
      `SELECT * FROM users
       ORDER BY id ASC`
    );

    return result.rows;
  }

  static async update(id, login, password, role) {
    const result = await pool.query(
      `UPDATE users
       SET login = $1, password = $2, role = $3
       WHERE id = $4
       RETURNING *`,
      [login, password, role, id]
    );

    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query(
      `DELETE FROM users
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    return result.rows[0];
  }
}

module.exports = UserDAO;