export type Severity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export type Finding = {
  id: string;
  title: string;
  severity: Severity;
  file: string;
  line: number;
  description: string;
  status: "FIXED" | "OPEN";
  impact: string;
  codePath: string;
  remediation: string;
  before: string;
  after: string;
  test: { name: string; code: string };
  verification: string[];
};

export const repository = {
  name: "breach-guardians-demo",
  branch: "main",
  status: "Security analysis complete",
  language: "Python",
  files: 128,
  lastScan: "2026-09-24 19:41 UTC",
  commit: "8f21c0d",
};

export const findings: Finding[] = [
  {
    id: "BG-001",
    title: "SQL Injection",
    severity: "CRITICAL",
    file: "backend/users.py",
    line: 42,
    description:
      "User-controlled request parameter is concatenated directly into a SQL query string.",
    status: "FIXED",
    impact:
      "User-controlled input reaches a database query without parameterization. An attacker can read, modify, or destroy arbitrary records in the users table.",
    codePath:
      "GET /api/users/:id → routes.get_user() → users.fetch_user(user_id) → cursor.execute(query)",
    remediation:
      "Use parameterized queries and bind user input as query parameters instead of string concatenation.",
    before: 'query = "SELECT * FROM users WHERE id=" + user_id\ncursor.execute(query)',
    after:
      'query = "SELECT * FROM users WHERE id = ?"\ncursor.execute(query, (user_id,))',
    test: {
      name: "test_sql_injection_payload_is_not_executed",
      code: `def test_sql_injection_payload_is_not_executed(client):
    resp = client.get("/api/users/1 OR 1=1")
    assert resp.status_code == 400
    assert User.query.count() == 3`,
    },
    verification: [
      "Regression test generated",
      "Test passed",
      "Fix verified",
    ],
  },
  {
    id: "BG-002",
    title: "Hardcoded API Secret",
    severity: "CRITICAL",
    file: "backend/config.py",
    line: 11,
    description:
      "A live third-party API secret is committed in source control as a plaintext constant.",
    status: "FIXED",
    impact:
      "Anyone with repository read access can impersonate the service against the payment provider and issue authenticated requests.",
    codePath: "config.py (module import) → payments.client(API_SECRET)",
    remediation:
      "Load the secret from the environment at runtime, remove it from history, and rotate the credential.",
    before: 'API_SECRET = "sk_live_51H8xQe2eZvKYlo2C9Xa7"',
    after:
      'API_SECRET = os.environ["API_SECRET"]\nif not API_SECRET:\n    raise RuntimeError("API_SECRET is not configured")',
    test: {
      name: "test_no_hardcoded_secrets_in_source",
      code: `def test_no_hardcoded_secrets_in_source():
    matches = scan_repo(pattern=r"sk_live_[A-Za-z0-9]+")
    assert matches == []`,
    },
    verification: ["Regression test generated", "Test passed", "Fix verified"],
  },
  {
    id: "BG-003",
    title: "Broken Authorization",
    severity: "HIGH",
    file: "backend/auth.py",
    line: 87,
    description:
      "Endpoint verifies authentication but never checks that the caller owns the requested resource.",
    status: "FIXED",
    impact:
      "Any authenticated user can read and update another tenant's records by changing the object id in the request (IDOR).",
    codePath:
      "PATCH /api/accounts/:id → require_login() → accounts.update(id, payload)",
    remediation:
      "Enforce an ownership check on every object lookup before mutating or returning data.",
    before: `@require_login
def update_account(account_id, payload):
    return db.accounts.update(account_id, payload)`,
    after: `@require_login
def update_account(account_id, payload, current_user):
    account = db.accounts.get(account_id)
    if account.owner_id != current_user.id:
        raise Forbidden()
    return db.accounts.update(account_id, payload)`,
    test: {
      name: "test_user_cannot_update_foreign_account",
      code: `def test_user_cannot_update_foreign_account(client, alice, bob):
    resp = client.patch(f"/api/accounts/{bob.account_id}", auth=alice)
    assert resp.status_code == 403`,
    },
    verification: ["Regression test generated", "Test passed", "Fix verified"],
  },
  {
    id: "BG-004",
    title: "Vulnerable Dependency",
    severity: "HIGH",
    file: "requirements.txt",
    line: 7,
    description:
      "Pinned dependency version is affected by a published remote code execution advisory.",
    status: "FIXED",
    impact:
      "A crafted YAML payload processed by the pinned library version can execute arbitrary code on the server.",
    codePath: "requirements.txt → pyyaml 5.3.1 → yaml.load() in importer.py",
    remediation:
      "Upgrade to a patched release and pin the minimum safe version in the lockfile.",
    before: "pyyaml==5.3.1",
    after: "pyyaml==6.0.2",
    test: {
      name: "test_dependency_audit_has_no_known_cves",
      code: `def test_dependency_audit_has_no_known_cves():
    report = pip_audit("requirements.txt")
    assert report.critical == 0 and report.high == 0`,
    },
    verification: ["Regression test generated", "Test passed", "Fix verified"],
  },
  {
    id: "BG-005",
    title: "Unsafe Input Handling",
    severity: "MEDIUM",
    file: "backend/api.py",
    line: 134,
    description:
      "Request body is consumed without schema validation or length limits before processing.",
    status: "FIXED",
    impact:
      "Malformed or oversized payloads reach business logic, causing unhandled exceptions and stack traces in responses.",
    codePath: "POST /api/reports → api.create_report(request.json)",
    remediation:
      "Validate and normalize the payload against an explicit schema, and reject anything outside the contract.",
    before: `def create_report(payload):
    return Report.create(title=payload["title"], body=payload["body"])`,
    after: `def create_report(payload):
    data = ReportSchema().load(payload)  # raises ValidationError
    return Report.create(title=data["title"], body=data["body"])`,
    test: {
      name: "test_invalid_payload_returns_422",
      code: `def test_invalid_payload_returns_422(client):
    resp = client.post("/api/reports", json={"title": 1})
    assert resp.status_code == 422`,
    },
    verification: ["Regression test generated", "Test passed", "Fix verified"],
  },
];

export const severityCounts: Record<Severity, number> = {
  CRITICAL: 2,
  HIGH: 2,
  MEDIUM: 1,
  LOW: 0,
};

export const agentTasks = [
  { name: "Repository reconnaissance", detail: "128 files mapped", done: true },
  { name: "Security architecture analysis", detail: "9 trust boundaries", done: true },
  { name: "Vulnerability identification", detail: "5 findings", done: true },
  { name: "Code-path analysis", detail: "5 sink traces", done: true },
  { name: "Remediation", detail: "5 patches proposed", done: true },
  { name: "Regression test generation", detail: "6 tests written", done: true },
  { name: "Verification", detail: "24 / 24 passing", done: true },
];

export const terminalLog = [
  "> INITIALIZING BOB 2.0 SECURITY AGENTS...",
  "> ANALYZING REPOSITORY breach-guardians-demo@main",
  "> MAPPING ATTACK SURFACES...",
  "> IDENTIFIED 5 SECURITY FINDINGS",
  "> GENERATING REMEDIATION...",
  "> RUNNING REGRESSION TESTS...",
  "> ALL TESTS PASSED",
  "> FIND IT. FIX IT. PROVE IT.",
];

export const productivity = [
  { label: "Manual security review", value: "~3 hours" },
  { label: "Bob-assisted workflow", value: "~15 minutes" },
  { label: "Security tests", value: "18 → 24" },
  { label: "Unresolved findings", value: "5 → 0" },
];

export const testSuite = [
  { name: "test_sql_injection_payload_is_not_executed", finding: "BG-001", ms: 42, status: "PASS" },
  { name: "test_no_hardcoded_secrets_in_source", finding: "BG-002", ms: 18, status: "PASS" },
  { name: "test_secret_rotation_enforced", finding: "BG-002", ms: 21, status: "PASS" },
  { name: "test_user_cannot_update_foreign_account", finding: "BG-003", ms: 66, status: "PASS" },
  { name: "test_dependency_audit_has_no_known_cves", finding: "BG-004", ms: 910, status: "PASS" },
  { name: "test_invalid_payload_returns_422", finding: "BG-005", ms: 33, status: "PASS" },
];
