import { NextRequest, NextResponse } from 'next/server';
import { Client } from 'pg';
import bcrypt from 'bcrypt';

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    const result = await client.query(
      'SELECT username, name, avatar, password FROM users WHERE username = $1',
      [username]
    );
    await client.end();

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }

    const hashedPassword = result.rows[0].password;
    const isValid = await bcrypt.compare(password, hashedPassword);

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      username: result.rows[0].username,
      name: result.rows[0].name,
      avatar: result.rows[0].avatar ? result.rows[0].avatar.toString('base64') : null,
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
