#!/usr/bin/env node
/**
 * Community Management System — Automated API Test Runner
 * =========================================================
 * Runs all endpoints in order, capturing tokens and IDs along
 * the way, and prints a colour-coded pass/fail summary table.
 *
 * Usage:
 *   node tests/api-runner.js                         # default: localhost:8080
 *   BASE_URL=http://my-server:8080 node tests/api-runner.js
 *
 * Credentials can be overridden via env vars:
 *   PLATFORM_ADMIN_EMAIL, PLATFORM_ADMIN_PASSWORD
 *   COMMUNITY_ADMIN_EMAIL, COMMUNITY_ADMIN_PASSWORD
 *   RESIDENT_EMAIL, RESIDENT_PASSWORD
 */

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:8080/api/v1'

// ─── Credentials ─────────────────────────────────────────────────────────────
const CREDS = {
  platformAdmin: {
    email: process.env.PLATFORM_ADMIN_EMAIL ?? 'platform@communitytrust.com',
    password: process.env.PLATFORM_ADMIN_PASSWORD ?? 'Password123',
  },
  communityAdmin: {
    email: process.env.COMMUNITY_ADMIN_EMAIL ?? 'admin@greenestate.com',
    password: process.env.COMMUNITY_ADMIN_PASSWORD ?? 'Password123',
  },
  resident: {
    email: process.env.RESIDENT_EMAIL ?? 'john@email.com',
    password: process.env.RESIDENT_PASSWORD ?? 'Password123',
  },
}

// ─── Shared state (populated during run) ─────────────────────────────────────
const ctx = {
  platformToken: null,
  communityAdminToken: null,
  residentToken: null,
  communityId: null,
  staffId: null,
  houseId: null,
  levyTypeId: null,
  levyId: null,
  paymentId: null,
}

// ─── Colours ─────────────────────────────────────────────────────────────────
const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m',
  gray: '\x1b[90m',
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
async function request(method, path, { body, token } = {}) {
  const url = `${BASE_URL}${path}`
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const opts = { method, headers }
  if (body) opts.body = JSON.stringify(body)

  const res = await fetch(url, opts)
  let json = null
  const text = await res.text()
  try { json = JSON.parse(text) } catch { /* plain text or empty body */ }

  return { status: res.status, body: json, raw: text }
}

const results = []

async function test(group, name, fn) {
  const label = `${c.dim}${group}${c.reset} ${name}`
  try {
    const { status, expected, pass, note } = await fn()
    const ok = pass ?? (expected ? status === expected : status < 400)
    results.push({ group, name, status, expected, ok, note })

    const icon = ok ? `${c.green}✓${c.reset}` : `${c.red}✗${c.reset}`
    const exp = expected ? ` (expected ${expected})` : ''
    const noteStr = note ? `  ${c.gray}— ${note}${c.reset}` : ''
    console.log(`  ${icon}  ${label}  ${c.cyan}${status}${c.reset}${exp}${noteStr}`)
  } catch (err) {
    results.push({ group, name, status: 'ERR', ok: false, note: err.message })
    console.log(`  ${c.red}✗${c.reset}  ${label}  ${c.red}ERROR: ${err.message}${c.reset}`)
  }
}

function header(title) {
  console.log(`\n${c.bold}${c.blue}━━━  ${title}  ━━━${c.reset}`)
}

// ─── Test suites ──────────────────────────────────────────────────────────────

async function runAuth() {
  header('1. AUTHENTICATION')

  await test('Auth', 'Login — Platform Admin', async () => {
    const r = await request('POST', '/auth/login', { body: CREDS.platformAdmin })
    if (r.body?.accessToken) ctx.platformToken = r.body.accessToken
    return { status: r.status, expected: 200, note: ctx.platformToken ? 'token captured' : 'NO TOKEN' }
  })

  await test('Auth', 'Login — Community Admin', async () => {
    const r = await request('POST', '/auth/login', { body: CREDS.communityAdmin })
    if (r.body?.accessToken) ctx.communityAdminToken = r.body.accessToken
    return { status: r.status, expected: 200, note: ctx.communityAdminToken ? 'token captured' : 'NO TOKEN' }
  })

  await test('Auth', 'Login — Resident', async () => {
    const r = await request('POST', '/auth/login', { body: CREDS.resident })
    if (r.body?.accessToken) ctx.residentToken = r.body.accessToken
    return { status: r.status, expected: 200, note: ctx.residentToken ? 'token captured' : 'NO TOKEN' }
  })

  await test('Auth', 'Login — Invalid credentials (expect 401)', async () => {
    const r = await request('POST', '/auth/login', { body: { email: 'bad@bad.com', password: 'wrong' } })
    return { status: r.status, expected: 401 }
  })

  await test('Auth', 'Login — Missing password (expect 400)', async () => {
    const r = await request('POST', '/auth/login', { body: { email: 'admin@greenestate.com' } })
    return { status: r.status, expected: 400 }
  })

  await test('Auth', 'Logout (expect 200 or 204)', async () => {
    const r = await request('POST', '/auth/logout', { token: ctx.communityAdminToken })
    return { status: r.status, pass: [200, 204].includes(r.status) }
  })
}

async function runCommunity() {
  header('2. COMMUNITY')

  await test('Community', 'Create — Platform Admin (expect 200/201)', async () => {
    const r = await request('POST', '/communities', {
      token: ctx.platformToken,
      body: {
        name: 'Green Estate',
        type: 'Residential Estate',
        address: 'Lekki Phase 1',
        lga: 'Eti-Osa',
        state: 'Lagos',
        phone: '08012345678',
        email: 'admin@greenestate.com',
      },
    })
    if (r.body?.id) ctx.communityId = r.body.id
    return { status: r.status, pass: [200, 201].includes(r.status), note: ctx.communityId ? `id=${ctx.communityId}` : 'no id' }
  })

  await test('Community', 'Create — No auth (expect 401)', async () => {
    const r = await request('POST', '/communities', { body: { name: 'Ghost' } })
    return { status: r.status, expected: 401 }
  })

  await test('Community', 'Create — Missing fields (expect 400)', async () => {
    const r = await request('POST', '/communities', { token: ctx.platformToken, body: { name: 'Incomplete' } })
    return { status: r.status, expected: 400 }
  })

  await test('Community', 'Get All Communities', async () => {
    const r = await request('GET', '/communities', { token: ctx.platformToken })
    return { status: r.status, pass: r.status < 300 }
  })

  await test('Community', 'Get by ID', async () => {
    if (!ctx.communityId) return { status: 0, pass: false, note: 'skipped — no communityId' }
    const r = await request('GET', `/communities/${ctx.communityId}`, { token: ctx.platformToken })
    return { status: r.status, expected: 200 }
  })

  await test('Community', 'Get by ID — Not found (expect 404)', async () => {
    const r = await request('GET', '/communities/00000000-0000-0000-0000-000000000000', { token: ctx.platformToken })
    return { status: r.status, expected: 404 }
  })

  await test('Community', 'Update Community', async () => {
    if (!ctx.communityId) return { status: 0, pass: false, note: 'skipped' }
    const r = await request('PUT', `/communities/${ctx.communityId}`, {
      token: ctx.communityAdminToken,
      body: { name: 'Green Estate Updated', type: 'Residential Estate', address: 'Lekki Phase 2', lga: 'Eti-Osa', state: 'Lagos', phone: '08099998888', email: 'contact@greenestate.com' },
    })
    return { status: r.status, pass: r.status < 300 }
  })
}

async function runStaff() {
  header('3. COMMUNITY STAFF')

  await test('Staff', 'Invite Staff (expect 200/201)', async () => {
    if (!ctx.communityId) return { status: 0, pass: false, note: 'skipped — no communityId' }
    const r = await request('POST', `/communities/${ctx.communityId}/staff`, {
      token: ctx.communityAdminToken,
      body: { firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@greenestate.com', role: 'COMMUNITY_STAFF' },
    })
    if (r.body?.id) ctx.staffId = r.body.id
    return { status: r.status, pass: [200, 201].includes(r.status), note: ctx.staffId ? `id=${ctx.staffId}` : 'no id in response' }
  })

  await test('Staff', 'Invite Staff — Duplicate email (expect 409)', async () => {
    if (!ctx.communityId) return { status: 0, pass: false, note: 'skipped' }
    const r = await request('POST', `/communities/${ctx.communityId}/staff`, {
      token: ctx.communityAdminToken,
      body: { firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@greenestate.com', role: 'COMMUNITY_STAFF' },
    })
    return { status: r.status, expected: 409 }
  })

  await test('Staff', 'Get All Staff', async () => {
    if (!ctx.communityId) return { status: 0, pass: false, note: 'skipped' }
    const r = await request('GET', `/communities/${ctx.communityId}/staff`, { token: ctx.communityAdminToken })
    return { status: r.status, pass: r.status < 300 }
  })

  await test('Staff', 'Update Staff Role', async () => {
    if (!ctx.communityId || !ctx.staffId) return { status: 0, pass: false, note: 'skipped — no staffId' }
    const r = await request('PUT', `/communities/${ctx.communityId}/staff/${ctx.staffId}`, {
      token: ctx.communityAdminToken,
      body: { role: 'COMMUNITY_ADMIN' },
    })
    return { status: r.status, pass: r.status < 300 }
  })
}

async function runHouses() {
  header('4. HOUSES')

  await test('Houses', 'Register House (expect 200/201)', async () => {
    if (!ctx.communityId) return { status: 0, pass: false, note: 'skipped' }
    const r = await request('POST', '/houses', {
      token: ctx.communityAdminToken,
      body: {
        communityId: ctx.communityId,
        houseNumber: 'A12',
        street: 'Main Street',
        resident: { firstName: 'John', lastName: 'Doe', email: 'john@email.com', phone: '08012345678' },
      },
    })
    if (r.body?.id) ctx.houseId = r.body.id
    return { status: r.status, pass: [200, 201].includes(r.status), note: ctx.houseId ? `id=${ctx.houseId}` : 'no id' }
  })

  await test('Houses', 'Register — Duplicate number (expect 409)', async () => {
    if (!ctx.communityId) return { status: 0, pass: false, note: 'skipped' }
    const r = await request('POST', '/houses', {
      token: ctx.communityAdminToken,
      body: {
        communityId: ctx.communityId,
        houseNumber: 'A12',
        street: 'Main Street',
        resident: { firstName: 'Dupe', lastName: 'User', email: 'dupe@email.com', phone: '08000000002' },
      },
    })
    return { status: r.status, expected: 409 }
  })

  await test('Houses', 'Register — Missing fields (expect 400)', async () => {
    const r = await request('POST', '/houses', { token: ctx.communityAdminToken, body: { communityId: ctx.communityId } })
    return { status: r.status, expected: 400 }
  })

  await test('Houses', 'Get All Houses', async () => {
    const r = await request('GET', '/houses', { token: ctx.communityAdminToken })
    return { status: r.status, pass: r.status < 300 }
  })

  await test('Houses', 'Search by keyword=A12', async () => {
    const r = await request('GET', '/houses/search?keyword=A12', { token: ctx.communityAdminToken })
    return { status: r.status, pass: r.status < 300 }
  })

  await test('Houses', 'Search — No match keyword', async () => {
    const r = await request('GET', '/houses/search?keyword=ZZZNOMATCH', { token: ctx.communityAdminToken })
    return { status: r.status, pass: r.status < 300, note: 'expect empty list, not 404' }
  })

  await test('Houses', 'Get by ID', async () => {
    if (!ctx.houseId) return { status: 0, pass: false, note: 'skipped' }
    const r = await request('GET', `/houses/${ctx.houseId}`, { token: ctx.communityAdminToken })
    return { status: r.status, expected: 200 }
  })

  await test('Houses', 'Get by ID — Not found (expect 404)', async () => {
    const r = await request('GET', '/houses/00000000-0000-0000-0000-000000000000', { token: ctx.communityAdminToken })
    return { status: r.status, expected: 404 }
  })

  await test('Houses', 'Update House', async () => {
    if (!ctx.houseId) return { status: 0, pass: false, note: 'skipped' }
    const r = await request('PUT', `/houses/${ctx.houseId}`, {
      token: ctx.communityAdminToken,
      body: { houseNumber: 'A12', street: 'New Main Street' },
    })
    return { status: r.status, pass: r.status < 300 }
  })
}

async function runLevyTypes() {
  header('5. LEVY TYPES')

  await test('LevyTypes', 'Create (expect 200/201)', async () => {
    const r = await request('POST', '/levy-types', {
      token: ctx.communityAdminToken,
      body: { name: 'Security Levy', amount: 5000, frequency: 'MONTHLY' },
    })
    if (r.body?.id) ctx.levyTypeId = r.body.id
    return { status: r.status, pass: [200, 201].includes(r.status), note: ctx.levyTypeId ? `id=${ctx.levyTypeId}` : 'no id' }
  })

  await test('LevyTypes', 'Create second type', async () => {
    const r = await request('POST', '/levy-types', {
      token: ctx.communityAdminToken,
      body: { name: 'Waste Management', amount: 2500, frequency: 'MONTHLY' },
    })
    return { status: r.status, pass: [200, 201].includes(r.status) }
  })

  await test('LevyTypes', 'Create — Missing fields (expect 400)', async () => {
    const r = await request('POST', '/levy-types', {
      token: ctx.communityAdminToken,
      body: { name: 'Incomplete' },
    })
    return { status: r.status, expected: 400 }
  })

  await test('LevyTypes', 'Get All', async () => {
    const r = await request('GET', '/levy-types', { token: ctx.communityAdminToken })
    return { status: r.status, pass: r.status < 300 }
  })

  await test('LevyTypes', 'Update', async () => {
    if (!ctx.levyTypeId) return { status: 0, pass: false, note: 'skipped' }
    const r = await request('PUT', `/levy-types/${ctx.levyTypeId}`, {
      token: ctx.communityAdminToken,
      body: { name: 'Security & Patrol Levy', amount: 6000, frequency: 'MONTHLY' },
    })
    return { status: r.status, pass: r.status < 300 }
  })

  await test('LevyTypes', 'Update — Not found (expect 404)', async () => {
    const r = await request('PUT', '/levy-types/00000000-0000-0000-0000-000000000000', {
      token: ctx.communityAdminToken,
      body: { name: 'Ghost', amount: 100, frequency: 'MONTHLY' },
    })
    return { status: r.status, expected: 404 }
  })
}

async function runLevies() {
  header('6. LEVIES (House Levy Instances)')

  await test('Levies', 'Generate House Levies', async () => {
    if (!ctx.communityId) return { status: 0, pass: false, note: 'skipped' }
    const r = await request('POST', '/levies/generate', {
      token: ctx.communityAdminToken,
      body: { communityId: ctx.communityId },
    })
    return { status: r.status, pass: r.status < 300 }
  })

  await test('Levies', 'Get All Levies', async () => {
    const r = await request('GET', '/levies', { token: ctx.communityAdminToken })
    if (Array.isArray(r.body) && r.body.length > 0) ctx.levyId = r.body[0].id
    else if (r.body?.content?.[0]?.id) ctx.levyId = r.body.content[0].id
    return { status: r.status, pass: r.status < 300, note: ctx.levyId ? `first id=${ctx.levyId}` : 'no levies yet' }
  })

  await test('Levies', 'Get Single Levy by ID', async () => {
    if (!ctx.levyId) return { status: 0, pass: false, note: 'skipped — no levyId' }
    const r = await request('GET', `/levies/${ctx.levyId}`, { token: ctx.communityAdminToken })
    return { status: r.status, expected: 200 }
  })

  await test('Levies', 'Get Levy — Not found (expect 404)', async () => {
    const r = await request('GET', '/levies/00000000-0000-0000-0000-000000000000', { token: ctx.communityAdminToken })
    return { status: r.status, expected: 404 }
  })
}

async function runPayments() {
  header('7. PAYMENTS')

  await test('Payments', 'Upload Payment Proof (expect 200/201)', async () => {
    if (!ctx.levyId) return { status: 0, pass: false, note: 'skipped — no levyId' }
    const r = await request('POST', '/payments', {
      token: ctx.residentToken,
      body: {
        houseLevyId: ctx.levyId,
        amount: 5000,
        paymentReference: 'TXN-ABC123XYZ',
        proofOfPaymentUrl: 'https://storage.example.com/receipts/proof-001.pdf',
      },
    })
    if (r.body?.id) ctx.paymentId = r.body.id
    return { status: r.status, pass: [200, 201].includes(r.status), note: ctx.paymentId ? `id=${ctx.paymentId}` : 'no id' }
  })

  await test('Payments', 'Upload — Missing fields (expect 400)', async () => {
    const r = await request('POST', '/payments', { token: ctx.residentToken, body: { amount: 5000 } })
    return { status: r.status, expected: 400 }
  })

  await test('Payments', 'Get All Payments', async () => {
    const r = await request('GET', '/payments', { token: ctx.communityAdminToken })
    return { status: r.status, pass: r.status < 300 }
  })

  await test('Payments', 'Verify Payment', async () => {
    if (!ctx.paymentId) return { status: 0, pass: false, note: 'skipped — no paymentId' }
    const r = await request('PUT', `/payments/${ctx.paymentId}/verify`, { token: ctx.communityAdminToken })
    return { status: r.status, pass: r.status < 300 }
  })

  await test('Payments', 'Verify Already-Verified (expect 409 or 400)', async () => {
    if (!ctx.paymentId) return { status: 0, pass: false, note: 'skipped' }
    const r = await request('PUT', `/payments/${ctx.paymentId}/verify`, { token: ctx.communityAdminToken })
    return { status: r.status, pass: [400, 409].includes(r.status) }
  })

  await test('Payments', 'Verify — No auth (expect 401)', async () => {
    if (!ctx.paymentId) return { status: 0, pass: false, note: 'skipped' }
    const r = await request('PUT', `/payments/${ctx.paymentId}/verify`)
    return { status: r.status, expected: 401 }
  })

  await test('Payments', 'Verify — Not found (expect 404)', async () => {
    const r = await request('PUT', '/payments/00000000-0000-0000-0000-000000000000/verify', { token: ctx.communityAdminToken })
    return { status: r.status, expected: 404 }
  })

  await test('Payments', 'Reject Payment', async () => {
    // Upload a fresh payment to reject so we don't conflict with the verified one
    let rejectId = null
    if (ctx.levyId) {
      const fresh = await request('POST', '/payments', {
        token: ctx.residentToken,
        body: {
          houseLevyId: ctx.levyId,
          amount: 5000,
          paymentReference: 'TXN-REJECT-TEST',
          proofOfPaymentUrl: 'https://storage.example.com/receipts/reject-test.pdf',
        },
      })
      rejectId = fresh.body?.id ?? null
    }
    if (!rejectId) return { status: 0, pass: false, note: 'skipped — could not create fresh payment' }
    const r = await request('PUT', `/payments/${rejectId}/reject`, { token: ctx.communityAdminToken })
    return { status: r.status, pass: r.status < 300 }
  })
}

async function runResidentPortal() {
  header('8. RESIDENT PORTAL')

  await test('Resident', 'Dashboard', async () => {
    const r = await request('GET', '/resident/dashboard', { token: ctx.residentToken })
    return { status: r.status, pass: r.status < 300 }
  })

  await test('Resident', 'Dashboard — No auth (expect 401)', async () => {
    const r = await request('GET', '/resident/dashboard')
    return { status: r.status, expected: 401 }
  })

  await test('Resident', 'Outstanding Levies', async () => {
    const r = await request('GET', '/resident/levies', { token: ctx.residentToken })
    return { status: r.status, pass: r.status < 300 }
  })

  await test('Resident', 'Payment History', async () => {
    const r = await request('GET', '/resident/payments', { token: ctx.residentToken })
    return { status: r.status, pass: r.status < 300 }
  })

  await test('Resident', 'Download Receipt', async () => {
    if (!ctx.paymentId) return { status: 0, pass: false, note: 'skipped' }
    const r = await request('GET', `/resident/payments/${ctx.paymentId}/receipt`, { token: ctx.residentToken })
    return { status: r.status, pass: r.status < 300 }
  })

  await test('Resident', 'Download Receipt — Not found (expect 404)', async () => {
    const r = await request('GET', '/resident/payments/00000000-0000-0000-0000-000000000000/receipt', { token: ctx.residentToken })
    return { status: r.status, expected: 404 }
  })
}

async function runNotifications() {
  header('9. NOTIFICATIONS')

  await test('Notifications', 'Get Notifications', async () => {
    const r = await request('GET', '/notifications', { token: ctx.communityAdminToken })
    return { status: r.status, pass: r.status < 300 }
  })
}

// ─── Summary ──────────────────────────────────────────────────────────────────
function printSummary() {
  const passed = results.filter((r) => r.ok).length
  const failed = results.filter((r) => !r.ok).length
  const total = results.length

  console.log(`\n${c.bold}${'─'.repeat(72)}${c.reset}`)
  console.log(`${c.bold}  RESULTS${c.reset}`)
  console.log(`${'─'.repeat(72)}`)

  // Group by module
  const groups = [...new Set(results.map((r) => r.group))]
  for (const group of groups) {
    const groupResults = results.filter((r) => r.group === group)
    const groupPass = groupResults.filter((r) => r.ok).length
    const groupTotal = groupResults.length
    const allOk = groupPass === groupTotal
    const icon = allOk ? `${c.green}✓${c.reset}` : `${c.red}✗${c.reset}`
    console.log(`  ${icon}  ${c.bold}${group}${c.reset}  ${c.gray}${groupPass}/${groupTotal}${c.reset}`)
    for (const r of groupResults) {
      if (!r.ok) {
        const exp = r.expected ? ` (expected ${r.expected}, got ${r.status})` : ` (got ${r.status})`
        console.log(`       ${c.red}↳ FAIL${c.reset} ${r.name}${exp}`)
      }
    }
  }

  console.log(`${'─'.repeat(72)}`)
  const passPct = total > 0 ? Math.round((passed / total) * 100) : 0
  const overallColor = failed === 0 ? c.green : failed <= 3 ? c.yellow : c.red
  console.log(
    `\n  ${overallColor}${c.bold}${passed} passed${c.reset}  ${c.red}${failed} failed${c.reset}  ${c.gray}(${total} total, ${passPct}% pass rate)${c.reset}\n`
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log(`\n${c.bold}${c.cyan}Community Management System — API Test Runner${c.reset}`)
  console.log(`${c.gray}Target: ${BASE_URL}${c.reset}`)
  console.log(`${c.gray}Time:   ${new Date().toISOString()}${c.reset}\n`)

  // Quick connectivity check
  try {
    const check = await fetch(`${BASE_URL}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}', signal: AbortSignal.timeout(4000) })
    console.log(`${c.green}● Server reachable${c.reset} (${check.status})\n`)
  } catch {
    console.log(`${c.red}✗ Cannot reach ${BASE_URL}${c.reset}`)
    console.log(`${c.yellow}  Make sure the backend is running, then retry.${c.reset}\n`)
    process.exit(1)
  }

  await runAuth()
  await runCommunity()
  await runStaff()
  await runHouses()
  await runLevyTypes()
  await runLevies()
  await runPayments()
  await runResidentPortal()
  await runNotifications()

  printSummary()
  process.exit(results.some((r) => !r.ok) ? 1 : 0)
}

main().catch((err) => {
  console.error(`${c.red}Fatal error: ${err.message}${c.reset}`)
  process.exit(1)
})
