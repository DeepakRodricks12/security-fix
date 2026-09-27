# 🛡️ SecurityFix

### AI-Assisted Security Audit & Remediation Workflow

**SecurityFix** is a cybersecurity workflow developed by **Breach Guardians** to demonstrate how security findings can be identified, remediated, and verified systematically during software development.

The project was developed as part of the **IBM Bob × Lablab.ai Hackathon**.

> **Audit → Identify → Remediate → Test → Re-audit → Verify**

---

## 🚨 The Problem

Security vulnerabilities are often discovered during development, but identifying a vulnerability is only the first step.

A practical security workflow also needs to:

* identify the root cause;
* implement a secure remediation;
* prevent regressions;
* verify that the vulnerability is actually resolved; and
* document the transition from vulnerable to secure code.

**SecurityFix demonstrates this complete lifecycle in a controlled security demonstration application.**

---

## 🔍 Initial Security Audit

The initial audit identified **four security findings**:

| ID        | Finding                        | Risk                                                                                           |
| --------- | ------------------------------ | ---------------------------------------------------------------------------------------------- |
| **F-001** | SQL Injection                  | Unsafe SQL string construction allowed attacker-controlled input to influence database queries |
| **F-002** | Identity / Session Handling    | User identity was derived from the client-controlled `X-Demo-User` header                      |
| **F-003** | Configuration Exposure         | Configuration information was accessible without appropriate authorization                     |
| **F-004** | Authorization / Access Control | Users could access resources without sufficient ownership-based authorization                  |

These findings were addressed through targeted code remediation followed by regression testing and a post-remediation security review.

---

## 🔥 F-001 — SQL Injection

### Before

The application constructed SQL queries using string interpolation.

```python
query = f"SELECT * FROM users WHERE id = '{user_id}'"
```

This created a SQL injection risk because untrusted input was incorporated directly into the SQL statement.

### After

The query was changed to use parameterized SQL:

```python
query = "SELECT * FROM users WHERE id = ?"
cursor.execute(query, (user_id,))
```

### Security improvement

* Removed SQL string interpolation
* Added parameterized queries
* Separated SQL instructions from user-supplied data

---

## 🔐 F-002 + F-004 — Identity & Authorization

### Before

The application relied on the client-controlled:

```http
X-Demo-User
```

header to determine the current user's identity.

This meant that changing the header could potentially change the identity used by the application.

### After

Identity handling was moved to a **Flask signed session**.

The application now establishes the authenticated identity through server-managed session state rather than trusting a client-supplied identity header.

Authorization checks were also introduced to ensure that users can only access resources they are authorized to access.

### Security improvement

* Removed trust in `X-Demo-User`
* Added Flask signed-session identity
* Added ownership-based authorization
* Reduced identity spoofing risk
* Enforced access-control checks at the application layer

---

## ⚙️ F-003 — Configuration Exposure

The initial application exposed configuration information through an endpoint without sufficient access restrictions.

The remediation introduced appropriate authorization controls around configuration access.

### Security improvement

* Restricted configuration access
* Reduced unnecessary information exposure
* Added authorization checks
* Included the endpoint in post-remediation verification

---

# 🔧 Remediation

The remediation transformed the application from the vulnerable baseline:

```text
580a0da
```

to the remediated implementation:

```text
1c9e7bd
```

### Before → After

| Before                                        | After                             |
| --------------------------------------------- | --------------------------------- |
| ❌ SQL string interpolation                    | ✅ Parameterized SQL queries       |
| ❌ `X-Demo-User` identity                      | ✅ Flask signed-session identity   |
| ❌ Unrestricted user access                    | ✅ Ownership-based authorization   |
| ❌ Configuration exposure                      | ✅ Authorized configuration access |
| ❌ Vulnerabilities without regression coverage | ✅ Automated regression testing    |

---

# 🧪 Regression Testing

After remediation, the application was tested using the project's automated test suite.

### Result

```text
25 passed
```

The tests provide regression coverage for the application after the security fixes were implemented.

The goal was not only to modify the vulnerable code, but also to verify that the remediation did not break the application's expected behavior.

---

# 🔎 Post-Remediation Re-Audit

SecurityFix follows remediation with a second security review.

The workflow is:

```text
Initial Audit
     │
     ▼
Findings Identified
     │
     ▼
Security Remediation
     │
     ▼
Regression Tests
     │
     ▼
Post-Remediation Re-Audit
     │
     ▼
Verified Security State
```

This creates a repeatable security lifecycle rather than treating vulnerability remediation as a one-time code change.

---

# 🏗️ SecurityFix Workflow

```text
┌──────────────────────┐
│   Security Audit     │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Identify Findings    │
│ F-001 → F-004        │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Security Remediation │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Regression Testing   │
│     25 Passed        │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│   Re-Audit           │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Verified Security    │
└──────────────────────┘
```

---

# 💻 Technology

The project uses technologies including:

* **Python**
* **Flask**
* **SQL / SQLite**
* **pytest**
* **Git**
* **IBM Bob**

IBM Bob was used as the AI-powered development environment during the implementation and remediation workflow.

---

# 📁 Project Scope

The security demonstration focuses on the application contained within:

```text
security-demo/
```

The remediation work was intentionally scoped to the demonstration application.

---

# 🚀 Running the Project

Clone the repository:

```bash
git clone <YOUR-REPOSITORY-URL>
cd <YOUR-REPOSITORY>
```

Create and activate a virtual environment:

```bash
python -m venv .venv
```

### Windows

```bash
.venv\Scripts\activate
```

### macOS / Linux

```bash
source .venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run the application according to the project's application entry point.

---

# 🧪 Running the Tests

Run:

```bash
pytest
```

Expected result after remediation:

```text
25 passed
```

---

# 🔄 Security Lifecycle

SecurityFix demonstrates a simple but repeatable security lifecycle:

**1. Audit**

Identify vulnerabilities and security weaknesses.

**2. Analyze**

Understand the root cause and potential impact.

**3. Remediate**

Implement secure coding and access-control changes.

**4. Test**

Run automated regression tests.

**5. Re-Audit**

Review the remediated application.

**6. Verify**

Confirm that the security improvements are reflected in the final implementation.

---

# 🎯 Project Objective

SecurityFix demonstrates that AI-assisted development can be combined with a structured security workflow:

> **Don't just find the vulnerability. Fix it, test it, and verify the fix.**

The project focuses on making security remediation a visible and repeatable part of the development lifecycle.

---

# 🛡️ About Breach Guardians

**Breach Guardians** is a cybersecurity initiative focused on building practical AI-driven security solutions.

### Website

https://breach-guardians-web.lovable.app/

### LinkedIn

https://www.linkedin.com/company/breach-guardians/

---

# 👤 Team

**Breach Guardians**

SecurityFix was developed as a cybersecurity demonstration project for the **IBM Bob × Lablab.ai Hackathon**.

---

# ⚠️ Disclaimer

This repository is intended for **educational, demonstration, and security-development purposes**.

The vulnerabilities discussed in this project were identified and remediated within a controlled demonstration environment. Do not use security testing techniques against systems without appropriate authorization.

---

## 🏆 Hackathon

**IBM Bob × Lablab.ai Hackathon**

Project: **SecurityFix**
Team: **Breach Guardians**

**Audit → Remediate → Test → Re-Audit → Verify**
