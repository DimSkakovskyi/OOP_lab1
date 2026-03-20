const pool = require('../config/db');

class CardDAO {
  static async create(accountId, cardNumber, expiryDate) {
    const result = await pool.query(
      `INSERT INTO cards (account_id, card_number, expiry_date)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [accountId, cardNumber, expiryDate]
    );

    return result.rows[0];
  }

  static async findById(id) {
    const result = await pool.query(
      `SELECT * FROM cards
       WHERE id = $1`,
      [id]
    );

    return result.rows[0];
  }

  static async findByAccountId(accountId) {
    const result = await pool.query(
      `SELECT * FROM cards
       WHERE account_id = $1
       ORDER BY id ASC`,
      [accountId]
    );

    return result.rows;
  }

  static async findByCardNumber(cardNumber) {
    const result = await pool.query(
      `SELECT * FROM cards
       WHERE card_number = $1`,
      [cardNumber]
    );

    return result.rows[0];
  }

  static async findAll() {
    const result = await pool.query(
      `SELECT * FROM cards
       ORDER BY id ASC`
    );

    return result.rows;
  }

  static async update(id, cardNumber, expiryDate) {
    const result = await pool.query(
      `UPDATE cards
       SET card_number = $1, expiry_date = $2
       WHERE id = $3
       RETURNING *`,
      [cardNumber, expiryDate, id]
    );

    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query(
      `DELETE FROM cards
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    return result.rows[0];
  }
}

module.exports = CardDAO;