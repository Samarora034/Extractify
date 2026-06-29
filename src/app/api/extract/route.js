import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

const rateMap = new Map();
const LIMITS = { free: 10, pro: 50, enterprise: Infinity };

function checkRate(userId, tier) {
  const now = Date.now();
  const entries = rateMap.get(userId) || [];
  const recent = entries.filter((t) => now - t < 60000);
  if (recent.length >= (LIMITS[tier] || 10)) return false;
  recent.push(now);
  rateMap.set(userId, recent);
  return true;
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!checkRate(user.id, user.tier)) return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });

  const { text, schemaName } = await req.json();

  const res = await fetch(`${process.env.SGLANG_SERVICE_URL}/extract`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, schema_name: schemaName }),
  });

  if (!res.ok) return NextResponse.json({ error: 'Extraction failed' }, { status: 502 });

  const data = await res.json();

  await prisma.extraction.create({
    data: { userId: user.id, inputText: text, schemaName, schemaDef: '{}', result: JSON.stringify(data.result), tokensUsed: data.tokens_used, latencyMs: data.latency_ms },
  });
  await prisma.usageLog.create({
    data: { userId: user.id, tokens: data.tokens_used, latencyMs: data.latency_ms, schemaName },
  });

  return NextResponse.json({ result: data.result, tokensUsed: data.tokens_used, latencyMs: data.latency_ms });
}
