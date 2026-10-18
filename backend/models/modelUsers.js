import { db } from '../config/db.js'

export default class UserModel {
  static async findByEmail(email) {
    const { rows } = await db.execute({
      sql: 'SELECT id, email, password_hash FROM users WHERE email = ?',
      args: [email],
    })
    return rows[0] ?? null
  }

  static async findById(id) {
    const { rows } = await db.execute({
      sql: 'SELECT id, email FROM users WHERE id = ?',
      args: [id],
    })
    return rows[0] ?? null
  }
}