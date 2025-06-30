import { NextRequest, NextResponse } from 'next/server';
import { Client } from 'pg';

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get('avatar') as File;
  const username = form.get('username') as string;

  if (!(file instanceof File) || typeof username !== 'string') {
    return NextResponse.json({ error: 'Missing avatar or username' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const base64 = buffer.toString('base64');

  const client = new Client({ connectionString: process.env.DATABASE_URL });
  try {
    await client.connect();
    await client.query('UPDATE users SET avatar = $1 WHERE username = $2', [buffer, username]);
    await client.end();
    return NextResponse.json({ avatar: base64 });
  } catch (err) {
    console.error('Avatar update failed:', err);
    return NextResponse.json({ error: 'Failed to update avatar' }, { status: 500 });
  }
}
