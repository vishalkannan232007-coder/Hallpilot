# HallPilot — Security & Privacy Architecture Plan

> **Security Mandate:** Multi-tenant isolation by design, least-privilege database policies, zero client-side credential exposure, and bulletproof student data privacy.

---

## 1. Threat Model & Security Principles

| Threat Scenario | Potential Impact | HallPilot Mitigation |
|---|---|---|
| **Cross-Tenant Data Leakage** | College A administrator accesses or modifies College B's seating data | Strict Supabase Row Level Security (RLS) on all tables bound to `auth.uid()` $\to$ `college_id`. |
| **Mass Student Roster Scraping** | Malicious bot downloads all register numbers and student names | Disallow `SELECT` on `seating_records` for `anon`. Expose only `SECURITY DEFINER` RPC requiring exact `(college_id, register_number)`. Rate limit requests. |
| **Credential & Secret Key Leakage** | Supabase Service Role Key exposed in Vite frontend bundle | Strictly enforce client-side use of `SUPABASE_ANON_KEY` only. Service role keys are prohibited from Vite `.env` and client code. |
| **Tampered / Malicious File Uploads** | Malformed Excel/CSV files crashing parsers, CSV formula injection | Client-side and server-side sanitized parsing, cell type enforcement (formula stripping: `'='`, `'+'`, `'-'`, `'@'`), payload size caps (10MB limit). |
| **Stale Seating Visibility** | Students viewing outdated seat assignments causing exam confusion | Timestamp-enforced query expiry (`expires_at > now()`) + explicit Admin "Unpublish" instant killswitch. |
| **Accidental Real PII Leakage** | Sensitive real-world student data committed to Git or public demo | Strict use of fictional sample datasets (`docs/sample_data.csv`). Pre-commit git guidelines. |

---

## 2. Supabase Row Level Security (RLS) Architecture

All tables in the public schema have RLS enabled by default:
```sql
ALTER TABLE colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE college_admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE seating_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE upload_batches ENABLE ROW LEVEL SECURITY;
```

### 2.1 Tenant Resolution Helper Function
A high-efficiency SQL helper checks the tenant membership of an authenticated user:

```sql
CREATE OR REPLACE FUNCTION get_auth_college_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
    SELECT college_id 
    FROM college_admins 
    WHERE user_id = auth.uid() AND is_active = TRUE
    LIMIT 1;
$$;
```

### 2.2 Table-by-Table RLS Policies

#### A. `colleges`
* **Public / Students (`anon`):** Can `SELECT` active colleges only (`is_active = TRUE`) to populate the college search dropdown. No modification allowed.
  ```sql
  CREATE POLICY "Public can view active colleges"
  ON colleges FOR SELECT
  TO anon, authenticated
  USING (is_active = TRUE);
  ```
* **Admins (`authenticated`):** Can update only their own college's details.
  ```sql
  CREATE POLICY "College admins can update own college"
  ON colleges FOR UPDATE
  TO authenticated
  USING (id = get_auth_college_id())
  WITH CHECK (id = get_auth_college_id());
  ```

#### B. `college_admins`
* Authenticated admins can view teammates within the same college:
  ```sql
  CREATE POLICY "Admins view colleagues in same college"
  ON college_admins FOR SELECT
  TO authenticated
  USING (college_id = get_auth_college_id());
  ```

#### C. `exam_sessions`
* **Public (`anon`):** Can view only published, non-expired sessions.
  ```sql
  CREATE POLICY "Public can view published active sessions"
  ON exam_sessions FOR SELECT
  TO anon
  USING (status = 'published' AND expires_at > now());
  ```
* **College Admins (`authenticated`):** Full CRUD over sessions matching their tenant.
  ```sql
  CREATE POLICY "Admins manage own college exam sessions"
  ON exam_sessions FOR ALL
  TO authenticated
  USING (college_id = get_auth_college_id())
  WITH CHECK (college_id = get_auth_college_id());
  ```

#### D. `seating_records`
* **Public (`anon`):** **NO SELECT/INSERT/UPDATE/DELETE GRANTED.**
  * *Crucial Architectural Choice:* Public users have 0% direct table access. All reads must go through the parameterized function `lookup_student_hall(p_college_id, p_register_number)`.
* **College Admins (`authenticated`):** Full access to their own college's records.
  ```sql
  CREATE POLICY "Admins manage own seating records"
  ON seating_records FOR ALL
  TO authenticated
  USING (college_id = get_auth_college_id())
  WITH CHECK (college_id = get_auth_college_id());
  ```

#### E. `upload_batches`
* Restricted entirely to tenant admins.
  ```sql
  CREATE POLICY "Admins view and insert upload batches"
  ON upload_batches FOR ALL
  TO authenticated
  USING (college_id = get_auth_college_id())
  WITH CHECK (college_id = get_auth_college_id());
  ```

---

## 3. Privacy & Anti-Scraping Safeguards

1. **Elimination of Public Rosters:**
   Students can only search for their specific record by providing both the College ID and their exact Register Number. HallPilot does not provide wildcard searches (`*`, `%`), hall-wide listings, or pagination of student lists to unauthenticated users.
2. **Minimal PII Exposure:**
   The search result returns solely what the student needs for examination logistics:
   - Exam Date, Session Slot (FN/AN), Timing
   - Hall / Room Number, Floor, Building
   - Seat Number
   - Subject / Course Code
   *Student full names and dates of birth are kept minimal or omitted from public search responses.*
3. **Client-Side Abuse Mitigation:**
   - Frontend debouncing and request throttling on the search button.
   - Cloudflare Turnstile / reCAPTCHA v3 readiness for high-traffic exam days.
   - Rate limiting on Supabase Edge / API layer (max 20 lookups per minute per IP).

---

## 4. Excel/CSV Upload Security & Sanitization

1. **Formula Injection (CSV Injection) Prevention:**
   Spreadsheets can contain malicious formulas starting with `=`, `+`, `-`, or `@` that execute in Microsoft Excel when opened by staff.
   *Mitigation:* During parsing, all cell values starting with formula control characters are prefixed with a single quote (`'`) or stripped.
2. **Memory & Size Caps:**
   - Maximum upload file size: 10 MB per file.
   - Maximum rows per batch: 10,000 records.
   - Processing is performed in streaming chunks to prevent browser tab crashes.
3. **Strict Type Coercion (Preserving Leading Zeros):**
   - Register numbers (e.g., `00142`) are strictly parsed as `String` / `Text`.
   - Never convert register numbers using `parseInt()` or `Number()` which drops leading zeros.

---

## 5. API Key Management & Environment Hygiene

1. **Client-Side Exposure Rules:**
   - Only `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are included in client `.env.production`.
   - The Supabase `service_role` key will **NEVER** exist in the repository, `.env.local`, or any client-side bundle.
2. **Repository Protection:**
   - `.gitignore` configured to ignore `.env`, `.env.local`, `.env.*.local`, and all raw upload test sheets.
   - Zero real student data in test suites: only synthesized mock data (e.g. `REG2026001`, `HALL-A1`).
