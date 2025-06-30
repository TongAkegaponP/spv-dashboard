import { NextRequest, NextResponse } from 'next/server';
import { Client } from 'pg';
import bcrypt from 'bcrypt';

export async function POST(req: NextRequest) {
  const { username, oldPass, newPass } = await req.json();

  if (!username) {
    return NextResponse.json({ error: 'Username is required' }, { status: 400 });
  }

  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  const result = await client.query(
    'SELECT password FROM users WHERE username = $1',
    [username]
  );

  if (result.rowCount === 0) {
    await client.end();
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const match = await bcrypt.compare(oldPass, result.rows[0].password);
  if (!match) {
    await client.end();
    return NextResponse.json({ error: 'Old password incorrect' }, { status: 401 });
  }

  const hashed = await bcrypt.hash(newPass, 10);
  await client.query('UPDATE users SET password = $1 WHERE username = $2', [hashed, username]);
  await client.end();

  return NextResponse.json({ success: true });
}
