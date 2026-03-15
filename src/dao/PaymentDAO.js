const pool = require('../config/db');

class PaymentDAO {
  static async create(accountId, amount, type, description = null) {
    const result = await pool.query(
      `INSERT INTO payments (account_id, amount, type, description)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [accountId, amount, type, description]
    );

    return result.rows[0];
  }

  static async findById(id) {
    const result = await pool.query(
      `SELECT * FROM payments
       WHERE id = $1`,
      [id]
    );

    return result.rows[0];
  }

  static async findByAccountId(accountId) {
    const result = await pool.query(
      `SELECT * FROM payments
       WHERE account_id = $1
       ORDER BY created_at DESC, id DESC`,
      [accountId]
    );

    return result.rows;
  }

  static async findAll() {
    const result = await pool.query(
      `SELECT * FROM payments
       ORDER BY created_at DESC, id DESC`
    );

    return result.rows;
  }

  static async update(id, amount, type, description) {
    const result = await pool.query(
      `UPDATE payments
       SET amount = $1, type = $2, description = $3
       WHERE id = $4
       RETURNING *`,
      [amount, type, description, id]
    );

    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query(
      `DELETE FROM payments
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    return result.rows[0];
  }
}

module.exports = PaymentDAO;