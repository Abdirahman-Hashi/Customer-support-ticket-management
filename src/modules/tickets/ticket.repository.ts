import { pool } from "../../config/db.js";

export async function insertTicket(ticket: any) {
  const query = `
    INSERT INTO tickets
    (id, title, description, category, priority, ai_confidence, ai_status)
    VALUES ($1,$2,$3,$4,$5,$6,$7)
    RETURNING *
  `;

  const values = [
    ticket.id,
    ticket.title,
    ticket.description,
    ticket.category,
    ticket.priority,
    ticket.ai_confidence,
    ticket.ai_status,
  ];

  const { rows } = await pool.query(query, values);
  return rows[0];
}

export async function updateClassification(id: string, ai: any) {
  await pool.query(
    `UPDATE tickets 
     SET category=$1, priority=$2, ai_confidence=$3, ai_status=$4
     WHERE id=$5`,
    [ai.category, ai.priority, ai.confidence, ai.fallback ? "fallback" : "done", id]
  );
}

export async function getTicketById(id: string) {
  const { rows } = await pool.query(
    `SELECT * FROM tickets WHERE id=$1` ,
    [id]
  );
  return rows[0];
}

export async function listTickets(filters: any) {
  const conditions: string[] = [];
  const values: any[] = [];

  if (filters.category) {
    values.push(filters.category);
    conditions.push(`category=$${values.length}`);
  }

  if (filters.priority) {
    values.push(filters.priority);
    conditions.push(`priority=$${values.length}`);
  }

  if (filters.status) {
    values.push(filters.status);
    conditions.push(`status=$${values.length}`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  // Pagination: apply defaults if not provided
  const limit = typeof filters.limit === "number" ? filters.limit : 50;
  const offset = typeof filters.offset === "number" ? filters.offset : 0;

  // Append pagination params
  values.push(limit);
  const limitIndex = values.length;
  values.push(offset);
  const offsetIndex = values.length;

  const query = `
    SELECT *
    FROM tickets
    ${where}
    ORDER BY created_at DESC
    LIMIT $${limitIndex}
    OFFSET $${offsetIndex}
  `;

  const { rows } = await pool.query(query, values);

  return rows;
}
