import { pool } from "../../config/db.js";

export async function insertUser(user: { name: string; email: string }) {
  const { rows } = await pool.query(
    `INSERT INTO users (name, email)
     VALUES ($1, $2)
     RETURNING *`,
    [user.name, user.email]
  );
  return rows[0];
}

export async function getUserById(id: number) {
  const { rows } = await pool.query(`SELECT * FROM users WHERE id=$1`, [id]);
  return rows[0];
}

export async function getUserByName(name: string) {
  const { rows } = await pool.query(`SELECT * FROM users WHERE lower(name)=lower($1) LIMIT 1`, [name]);
  return rows[0];
}

export async function listUsers(limit = 50, offset = 0) {
  const { rows } = await pool.query(
    `SELECT * FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
  return rows;
}
