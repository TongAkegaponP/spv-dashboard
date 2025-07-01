import { NextRequest, NextResponse } from 'next/server';
import { Client } from 'pg';

export async function GET(req: NextRequest) {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  const result = await client.query(`
    SELECT * FROM sales
    WHERE year IN (
      (SELECT MAX(year) FROM sales),
      (SELECT MAX(year) - 1 FROM sales)
    )
    ORDER BY year DESC
  `);

  await client.end();

  if (result.rowCount === 0) {
    return NextResponse.json({ error: 'No sales data found' }, { status: 404 });
  }

  return NextResponse.json({
    current: result.rows[0] || null,
    previous: result.rows[1] || null,
  });
}
