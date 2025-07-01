import { NextRequest, NextResponse } from 'next/server';
import { Client } from 'pg';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('avatar') as File;
  const username = formData.get('username') as string;

  if (!file || !username) {
    return NextResponse.json({ error: 'Missing avatar or username' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  try {
    await client.query('UPDATE users SET avatar = $1 WHERE username = $2', [buffer, username]);
    return NextResponse.json({ avatar: buffer.toString('base64') });
  } catch (err) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  } finally {
    await client.end();
  }
}

export async function DELETE(req: NextRequest) {
  const { username } = await req.json();

  if (!username) {
    return NextResponse.json({ error: 'Username is required' }, { status: 400 });
  }

  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  try {
    await client.query('UPDATE users SET avatar = NULL WHERE username = $1', [username]);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Delete error:', err);
    return NextResponse.json({ error: 'Failed to remove avatar' }, { status: 500 });
  } finally {
    await client.end();
  }
}
