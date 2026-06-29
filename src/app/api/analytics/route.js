import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const uid = session.user.id;
  const [totalExtractions, agg, bySchema] = await Promise.all([
    prisma.extraction.count({ where: { userId: uid } }),
    prisma.usageLog.aggregate({ where: { userId: uid }, _sum: { tokens: true }, _avg: { latencyMs: true } }),
    prisma.usageLog.groupBy({ by: ['schemaName'], where: { userId: uid }, _sum: { tokens: true }, _count: true }),
  ]);

  return NextResponse.json({
    totalExtractions,
    totalTokens: agg._sum.tokens || 0,
    avgLatency: Math.round(agg._avg.latencyMs || 0),
    bySchema: bySchema.map((s) => ({ name: s.schemaName, tokens: s._sum.tokens, count: s._count })),
  });
}
