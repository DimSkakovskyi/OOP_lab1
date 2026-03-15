const pool = require('../config/db');

class AccountDAO {
  static async create(userId, accountNumber, balance = 0, isBlocked = false) {
    const result = await pool.query(
      `INSERT INTO accounts (user_id, account_number, balance, is_blocked)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [userId, accountNumber, balance, isBlocked]
    );

    return result.rows[0];
  }

  static async findById(id) {
    const result = await pool.query(
      `SELECT * FROM accounts
       WHERE id = $1`,
      [id]
    );

    return result.rows[0];
  }

  static async findByUserId(userId) {
    const result = await pool.query(
      `SELECT * FROM accounts
       WHERE user_id = $1
       ORDER BY id ASC`,
      [userId]
    );

    return result.rows;
  }

  static async findByAccountNumber(accountNumber) {
    const result = await pool.query(
      `SELECT * FROM accounts
       WHERE account_number = $1`,
      [accountNumber]
    );

    return result.rows[0];
  }

  static async findAll() {
    const result = await pool.query(
      `SELECT * FROM accounts
       ORDER BY id ASC`
    );

    return result.rows;
  }

  static async update(id, accountNumber, balance, isBlocked) {
    const result = await pool.query(
      `UPDATE accounts
       SET account_number = $1, balance = $2, is_blocked = $3
       WHERE id = $4
       RETURNING *`,
      [accountNumber, balance, isBlocked, id]
    );

    return result.rows[0];
  }

  static async updateBalance(id, balance) {
    const result = await pool.query(
      `UPDATE accounts
       SET balance = $1
       WHERE id = $2
       RETURNING *`,
      [balance, id]
    );

    return result.rows[0];
  }

  static async block(id) {
    const result = await pool.query(
      `UPDATE accounts
       SET is_blocked = TRUE
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    return result.rows[0];
  }

  static async unblock(id) {
    const result = await pool.query(
      `UPDATE accounts
       SET is_blocked = FALSE
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query(
      `DELETE FROM accounts
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    return result.rows[0];
  }
}

module.exports = AccountDAO;