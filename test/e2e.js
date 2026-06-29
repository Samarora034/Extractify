#!/usr/bin/env node
/**
 * End-to-end integration test for AI Data Extractor.
 * Tests: Register → Login → Extract (all schemas) → History → Analytics → Settings
 * 
 * Run:
 *   1. Start mock SGLang: python3 sglang-service/mock_sglang_server.py
 *   2. Start SGLang service: cd sglang-service && uvicorn main:app --port 8100
 *   3. Start Next.js: npm run dev
 *   4. Run tests: node test/e2e.js
 */

const BASE = 'http://localhost:3000';
let cookie = '';
const testEmail = `test_${Date.now()}@example.com`;
const testPassword = 'TestPass123!';

async function req(method, path, body) {
  const opts = { method, headers: { 'Content-Type': 'application/json' } };
  if (cookie) opts.headers['Cookie'] = cookie;
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${BASE}${path}`, opts);
  const setCookie = res.headers.get('set-cookie');
  if (setCookie) cookie = setCookie.split(';')[0];
  return { status: res.status, data: await res.json().catch(() => null), headers: res.headers };
}

async function test(name, fn) {
  try {
    await fn();
    console.log(`  ✅ ${name}`);
  } catch (e) {
    console.log(`  ❌ ${name}: ${e.message}`);
    process.exitCode = 1;
  }
}

function assert(cond, msg) { if (!cond) throw new Error(msg); }

async function run() {
  console.log('\n🧪 AI Data Extractor - E2E Integration Tests\n');
  console.log(`  Target: ${BASE}`);
  console.log(`  Test user: ${testEmail}\n`);

  // AUTH TESTS
  console.log('── Auth ──');
  
  await test('Register new user', async () => {
    const { status } = await req('POST', '/api/auth/register', { name: 'Test User', email: testEmail, password: testPassword });
    assert(status === 200, `Expected 200, got ${status}`);
  });

  await test('Reject duplicate registration', async () => {
    const { status } = await req('POST', '/api/auth/register', { name: 'Dup', email: testEmail, password: testPassword });
    assert(status === 409, `Expected 409, got ${status}`);
  });

  await test('Login via NextAuth credentials', async () => {
    // Get CSRF token first
    const csrfRes = await fetch(`${BASE}/api/auth/csrf`);
    const { csrfToken } = await csrfRes.json();
    const loginRes = await fetch(`${BASE}/api/auth/callback/credentials`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ email: testEmail, password: testPassword, csrfToken }),
      redirect: 'manual',
    });
    const sc = loginRes.headers.get('set-cookie') || '';
    cookie = sc.split(',').map(c => c.split(';')[0]).join('; ');
    assert(cookie.includes('next-auth'), 'No session cookie received');
  });

  await test('Session is valid', async () => {
    const res = await fetch(`${BASE}/api/auth/session`, { headers: { Cookie: cookie } });
    const session = await res.json();
    assert(session.user?.email === testEmail, 'Session email mismatch');
  });

  // EXTRACTION TESTS
  console.log('\n── Extraction ──');

  const sampleTexts = {
    invoice: 'Invoice #INV-2024-0042 from Acme Corp dated March 15, 2024. Total: $1,250.00 USD. Items: Web Development Services (10 hours @ $100/hr), Cloud Hosting Monthly ($250).',
    resume: 'Jane Smith | jane.smith@email.com | +1-555-0123. Skills: Python, ML, FastAPI, React. Experience: Senior ML Engineer at TechCorp (2022-present), Data Scientist at DataInc (2019-2022). Education: M.S. Computer Science from MIT (2019).',
    email: 'From: john@company.com To: team@company.com Subject: Q4 Planning Meeting. Hi team, great progress on Q3! Action items: Review Q3 metrics by Friday, submit budget proposals, schedule 1-on-1s.',
    article: 'The Rise of Structured Generation in LLM Systems by Dr. Sarah Chen (March 2024). Constrained decoding techniques are transforming production LLM systems. Key points: JSON schema constraints eliminate malformed outputs, RadixAttention enables KV cache reuse, 3x throughput improvement.',
  };

  for (const [schema, text] of Object.entries(sampleTexts)) {
    await test(`Extract ${schema}`, async () => {
      const { status, data } = await req('POST', '/api/extract', { text, schemaName: schema });
      assert(status === 200, `Status ${status}: ${JSON.stringify(data)}`);
      assert(data.result && typeof data.result === 'object', 'No result object');
      assert(typeof data.tokensUsed === 'number', 'Missing tokensUsed');
      assert(typeof data.latencyMs === 'number', 'Missing latencyMs');
      console.log(`       → ${JSON.stringify(data.result).slice(0, 80)}...`);
    });
  }

  // HISTORY TESTS
  console.log('\n── History ──');

  await test('Fetch extraction history', async () => {
    const { status, data } = await req('GET', '/api/extractions');
    assert(status === 200, `Status ${status}`);
    assert(Array.isArray(data), 'Expected array');
    assert(data.length === 4, `Expected 4 extractions, got ${data.length}`);
    console.log(`       → ${data.length} extractions saved`);
  });

  // ANALYTICS TESTS
  console.log('\n── Analytics ──');

  await test('Fetch usage analytics', async () => {
    const { status, data } = await req('GET', '/api/analytics');
    assert(status === 200, `Status ${status}`);
    assert(data.totalExtractions === 4, `Expected 4, got ${data.totalExtractions}`);
    assert(data.totalTokens > 0, 'No tokens recorded');
    assert(data.bySchema.length > 0, 'No schema breakdown');
    console.log(`       → ${data.totalExtractions} extractions, ${data.totalTokens} tokens, avg ${data.avgLatency}ms`);
  });

  // SETTINGS TESTS
  console.log('\n── Settings ──');

  await test('Get user settings', async () => {
    const { status, data } = await req('GET', '/api/settings');
    assert(status === 200, `Status ${status}`);
    assert(data.email === testEmail, 'Email mismatch');
    assert(data.tier === 'free', 'Tier mismatch');
  });

  await test('Update user name', async () => {
    const { status, data } = await req('PATCH', '/api/settings', { name: 'Updated Name' });
    assert(status === 200, `Status ${status}`);
    assert(data.name === 'Updated Name', 'Name not updated');
  });

  // RATE LIMITING TEST
  console.log('\n── Rate Limiting ──');

  await test('Rate limit enforced (free tier = 10/min)', async () => {
    // We already used 4 requests. Fire 6 more to hit the limit, then 1 more to trigger 429.
    for (let i = 0; i < 6; i++) {
      await req('POST', '/api/extract', { text: 'test', schemaName: 'invoice' });
    }
    const { status } = await req('POST', '/api/extract', { text: 'test', schemaName: 'invoice' });
    assert(status === 429, `Expected 429, got ${status}`);
  });

  console.log('\n────────────────────────────────');
  console.log(process.exitCode ? '❌ SOME TESTS FAILED' : '✅ ALL TESTS PASSED');
  console.log('────────────────────────────────\n');
}

run().catch(e => { console.error(e); process.exit(1); });
