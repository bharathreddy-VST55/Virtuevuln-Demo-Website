# Database Design Documentation

## Current Database Schema

### Technology Stack
- **Database**: PostgreSQL 17
- **ORM**: MikroORM
- **Connection**: `postgres://bc:bc@postgres:5432/bc`

### Current Tables

#### 1. `user` Table
```sql
CREATE TABLE "user" (
  "id" SERIAL PRIMARY KEY,
  "created_at" TIMESTAMPTZ(0) NOT NULL,
  "updated_at" TIMESTAMPTZ(0) NOT NULL,
  "email" VARCHAR(255) NOT NULL,
  "password" VARCHAR(255) NOT NULL,
  "first_name" VARCHAR(255) NOT NULL,
  "last_name" VARCHAR(255) NOT NULL,
  "is_admin" BOOLEAN NOT NULL,
  "photo" BYTEA NULL,
  "company" VARCHAR(255) NOT NULL,
  "card_number" VARCHAR(255) NOT NULL,
  "phone_number" VARCHAR(255) NOT NULL,
  "is_basic" BOOLEAN NOT NULL
);

CREATE INDEX "IDX_users_email" ON "user" ("email");
```

**Issues**:
- No unique constraint on email (allows duplicates)
- Password stored as varchar (should use specific length)
- Sensitive data (card_number) stored in plaintext
- No password complexity enforcement
- No account lockout mechanism
- Photo stored as BYTEA (should be file reference)

#### 2. `product` Table
```sql
CREATE TABLE "product" (
  "id" SERIAL PRIMARY KEY,
  "created_at" TIMESTAMPTZ(0) NOT NULL DEFAULT NOW(),
  "category" VARCHAR(255) NOT NULL,
  "photo_url" VARCHAR(255) NOT NULL,
  "name" VARCHAR(255) NOT NULL,
  "description" VARCHAR(255) NULL,
  "views_count" INT DEFAULT 0
);
```

**Issues**:
- No indexes on frequently queried fields (category, created_at)
- No foreign key relationships
- No soft delete mechanism
- Views count could be optimized with separate table

#### 3. `testimonial` Table
```sql
CREATE TABLE "testimonial" (
  "id" SERIAL PRIMARY KEY,
  "created_at" TIMESTAMPTZ(0) NOT NULL,
  "updated_at" TIMESTAMPTZ(0) NOT NULL,
  "name" VARCHAR(255) NOT NULL,
  "title" VARCHAR(255) NOT NULL,
  "message" VARCHAR(255) NOT NULL
);
```

**Issues**:
- No user relationship (who created the testimonial)
- No moderation/approval status
- Message length limited to 255 characters
- No indexes for sorting/filtering

## Recommended Database Redesign

### Entity Relationship Diagram (Text)

```
┌─────────────┐         ┌──────────────┐
│    User    │─────────│    Role      │
│            │         │              │
│ - id       │         │ - id         │
│ - email    │         │ - name       │
│ - password │         │ - permissions│
│ - profile  │         └──────────────┘
└─────────────┘
      │
      │ 1:N
      │
      ▼
┌─────────────┐         ┌──────────────┐
│  Session   │         │  Testimonial │
│            │         │              │
│ - id       │         │ - id         │
│ - user_id  │         │ - user_id    │
│ - token    │         │ - content    │
│ - expires  │         │ - status     │
└─────────────┘         └──────────────┘

┌─────────────┐         ┌──────────────┐
│  Product   │         │   Upload    │
│            │         │              │
│ - id       │         │ - id         │
│ - name     │         │ - user_id    │
│ - category │         │ - filename   │
│ - views    │         │ - path       │
└─────────────┘         │ - type       │
                        │ - size       │
                        └──────────────┘

┌─────────────┐
│ Audit Log  │
│            │
│ - id       │
│ - user_id  │
│ - action   │
│ - resource │
│ - timestamp│
└─────────────┘
```

### Recommended Schema

#### 1. Enhanced `users` Table
```sql
CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
  "email" VARCHAR(255) NOT NULL UNIQUE,
  "password_hash" VARCHAR(255) NOT NULL, -- Argon2 hash
  "first_name" VARCHAR(100) NOT NULL,
  "last_name" VARCHAR(100) NOT NULL,
  "phone_number" VARCHAR(20),
  "company" VARCHAR(255),
  "email_verified" BOOLEAN NOT NULL DEFAULT FALSE,
  "email_verification_token" VARCHAR(255),
  "password_reset_token" VARCHAR(255),
  "password_reset_expires" TIMESTAMPTZ,
  "failed_login_attempts" INT NOT NULL DEFAULT 0,
  "locked_until" TIMESTAMPTZ,
  "last_login" TIMESTAMPTZ,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "deleted_at" TIMESTAMPTZ, -- Soft delete
  CONSTRAINT "users_email_check" CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

CREATE UNIQUE INDEX "idx_users_email" ON "users" ("email") WHERE "deleted_at" IS NULL;
CREATE INDEX "idx_users_uuid" ON "users" ("uuid");
CREATE INDEX "idx_users_email_verification_token" ON "users" ("email_verification_token");
```

#### 2. `roles` Table
```sql
CREATE TABLE "roles" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(50) NOT NULL UNIQUE,
  "description" TEXT,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO "roles" ("name", "description") VALUES
  ('admin', 'Administrator with full access'),
  ('user', 'Standard user'),
  ('moderator', 'Content moderator');

CREATE TABLE "user_roles" (
  "user_id" INT NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "role_id" INT NOT NULL REFERENCES "roles"("id") ON DELETE CASCADE,
  "assigned_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY ("user_id", "role_id")
);

CREATE INDEX "idx_user_roles_user" ON "user_roles" ("user_id");
CREATE INDEX "idx_user_roles_role" ON "user_roles" ("role_id");
```

#### 3. `sessions` Table
```sql
CREATE TABLE "sessions" (
  "id" SERIAL PRIMARY KEY,
  "user_id" INT NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "token" VARCHAR(255) NOT NULL UNIQUE,
  "refresh_token" VARCHAR(255),
  "ip_address" INET,
  "user_agent" TEXT,
  "expires_at" TIMESTAMPTZ NOT NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "revoked_at" TIMESTAMPTZ
);

CREATE INDEX "idx_sessions_user" ON "sessions" ("user_id");
CREATE INDEX "idx_sessions_token" ON "sessions" ("token");
CREATE INDEX "idx_sessions_expires" ON "sessions" ("expires_at");
```

#### 4. Enhanced `products` Table
```sql
CREATE TABLE "products" (
  "id" SERIAL PRIMARY KEY,
  "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
  "name" VARCHAR(255) NOT NULL,
  "slug" VARCHAR(255) NOT NULL UNIQUE,
  "category_id" INT REFERENCES "categories"("id"),
  "description" TEXT,
  "photo_url" VARCHAR(500),
  "price" DECIMAL(10, 2),
  "stock" INT DEFAULT 0,
  "views_count" INT DEFAULT 0,
  "created_by" INT REFERENCES "users"("id"),
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "deleted_at" TIMESTAMPTZ
);

CREATE INDEX "idx_products_category" ON "products" ("category_id");
CREATE INDEX "idx_products_slug" ON "products" ("slug");
CREATE INDEX "idx_products_created_at" ON "products" ("created_at" DESC);
CREATE INDEX "idx_products_views" ON "products" ("views_count" DESC);

CREATE TABLE "categories" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(100) NOT NULL UNIQUE,
  "slug" VARCHAR(100) NOT NULL UNIQUE,
  "description" TEXT,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

#### 5. Enhanced `testimonials` Table
```sql
CREATE TABLE "testimonials" (
  "id" SERIAL PRIMARY KEY,
  "user_id" INT NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "name" VARCHAR(255) NOT NULL,
  "title" VARCHAR(255) NOT NULL,
  "message" TEXT NOT NULL, -- Increased from VARCHAR(255)
  "status" VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending, approved, rejected
  "moderated_by" INT REFERENCES "users"("id"),
  "moderated_at" TIMESTAMPTZ,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "deleted_at" TIMESTAMPTZ,
  CONSTRAINT "testimonials_status_check" CHECK (status IN ('pending', 'approved', 'rejected'))
);

CREATE INDEX "idx_testimonials_user" ON "testimonials" ("user_id");
CREATE INDEX "idx_testimonials_status" ON "testimonials" ("status");
CREATE INDEX "idx_testimonials_created" ON "testimonials" ("created_at" DESC);
```

#### 6. `uploads` Table (Secure File Management)
```sql
CREATE TABLE "uploads" (
  "id" SERIAL PRIMARY KEY,
  "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
  "user_id" INT NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "original_filename" VARCHAR(255) NOT NULL,
  "stored_filename" VARCHAR(255) NOT NULL UNIQUE,
  "file_path" VARCHAR(500) NOT NULL,
  "mime_type" VARCHAR(100) NOT NULL,
  "file_size" BIGINT NOT NULL,
  "file_hash" VARCHAR(64), -- SHA-256
  "upload_type" VARCHAR(50) NOT NULL, -- avatar, product_photo, document
  "virus_scan_status" VARCHAR(20) DEFAULT 'pending', -- pending, clean, infected
  "virus_scan_date" TIMESTAMPTZ,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "deleted_at" TIMESTAMPTZ,
  CONSTRAINT "uploads_size_check" CHECK (file_size > 0 AND file_size <= 10485760) -- 10MB max
);

CREATE INDEX "idx_uploads_user" ON "uploads" ("user_id");
CREATE INDEX "idx_uploads_type" ON "uploads" ("upload_type");
CREATE INDEX "idx_uploads_hash" ON "uploads" ("file_hash");
```

#### 7. `audit_logs` Table
```sql
CREATE TABLE "audit_logs" (
  "id" SERIAL PRIMARY KEY,
  "user_id" INT REFERENCES "users"("id") ON DELETE SET NULL,
  "action" VARCHAR(50) NOT NULL, -- login, logout, create, update, delete
  "resource_type" VARCHAR(50) NOT NULL, -- user, product, testimonial
  "resource_id" INT,
  "ip_address" INET,
  "user_agent" TEXT,
  "request_data" JSONB,
  "response_status" INT,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX "idx_audit_logs_user" ON "audit_logs" ("user_id");
CREATE INDEX "idx_audit_logs_action" ON "audit_logs" ("action");
CREATE INDEX "idx_audit_logs_resource" ON "audit_logs" ("resource_type", "resource_id");
CREATE INDEX "idx_audit_logs_created" ON "audit_logs" ("created_at" DESC);
```

#### 8. `payment_cards` Table (PCI Compliance)
```sql
CREATE TABLE "payment_cards" (
  "id" SERIAL PRIMARY KEY,
  "user_id" INT NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "card_last_four" VARCHAR(4) NOT NULL, -- Only store last 4 digits
  "card_brand" VARCHAR(20), -- visa, mastercard, etc.
  "expiry_month" INT NOT NULL,
  "expiry_year" INT NOT NULL,
  "is_default" BOOLEAN NOT NULL DEFAULT FALSE,
  "token" VARCHAR(255), -- Token from payment processor (not card number)
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "deleted_at" TIMESTAMPTZ,
  CONSTRAINT "payment_cards_expiry_check" CHECK (expiry_month >= 1 AND expiry_month <= 12)
);

CREATE INDEX "idx_payment_cards_user" ON "payment_cards" ("user_id");
```

## Security Improvements

### 1. Password Storage
- **Current**: Argon2 hash (good, but stored in `password` column)
- **Recommended**: 
  - Use `password_hash` column name (clearer intent)
  - Enforce minimum password complexity
  - Implement password history (prevent reuse)
  - Add password expiration for sensitive accounts

### 2. Sensitive Data
- **Current**: `card_number` stored in plaintext
- **Recommended**:
  - Never store full card numbers
  - Use payment processor tokens
  - Store only last 4 digits for display
  - Consider PCI DSS compliance requirements

### 3. Authentication
- **Current**: Basic JWT implementation
- **Recommended**:
  - Implement refresh tokens
  - Store sessions in database
  - Track login attempts and implement lockout
  - Log authentication events

### 4. Access Control
- **Current**: Simple `is_admin` boolean
- **Recommended**:
  - Role-based access control (RBAC)
  - Permission-based system
  - Audit logging for access control changes

### 5. Data Integrity
- **Current**: Basic constraints
- **Recommended**:
  - Foreign key constraints
  - Check constraints for data validation
  - Unique constraints where appropriate
  - Soft deletes for audit trail

## Database User Configuration

### Recommended Database Users

```sql
-- Application user (least privilege)
CREATE USER app_user WITH PASSWORD 'strong_random_password';
GRANT CONNECT ON DATABASE bc TO app_user;
GRANT USAGE ON SCHEMA public TO app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO app_user;

-- Read-only user for reporting
CREATE USER read_only_user WITH PASSWORD 'strong_random_password';
GRANT CONNECT ON DATABASE bc TO read_only_user;
GRANT USAGE ON SCHEMA public TO read_only_user;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO read_only_user;

-- Migration user (for schema changes)
CREATE USER migration_user WITH PASSWORD 'strong_random_password';
GRANT ALL PRIVILEGES ON DATABASE bc TO migration_user;
GRANT ALL PRIVILEGES ON SCHEMA public TO migration_user;
```

## Migration Strategy

### Phase 1: Add New Tables
1. Create new tables alongside existing ones
2. Migrate data gradually
3. Update application to use new tables
4. Keep old tables for rollback

### Phase 2: Data Migration
1. Migrate users to new schema
2. Hash sensitive data (if not already hashed)
3. Create relationships and foreign keys
4. Populate audit logs

### Phase 3: Application Update
1. Update ORM models
2. Update application code
3. Test thoroughly
4. Deploy with feature flags

### Phase 4: Cleanup
1. Archive old tables
2. Remove unused columns
3. Update indexes
4. Document changes

## Index Recommendations

### High-Priority Indexes
- `users.email` (unique, frequently queried)
- `sessions.token` (authentication lookups)
- `products.category_id` (filtering)
- `testimonials.status` (moderation queries)
- `audit_logs.created_at` (time-based queries)

### Composite Indexes
- `(user_id, created_at)` on sessions (user session history)
- `(status, created_at)` on testimonials (moderation queue)
- `(resource_type, resource_id)` on audit_logs (resource history)

## Backup and Recovery

### Recommended Backup Strategy
1. **Daily Full Backups**: Complete database dump
2. **Hourly Incremental**: WAL (Write-Ahead Log) archiving
3. **Point-in-Time Recovery**: Enabled via WAL
4. **Offsite Storage**: Encrypted backups stored remotely

### Retention Policy
- Daily backups: 30 days
- Weekly backups: 12 weeks
- Monthly backups: 12 months

## Performance Considerations

1. **Connection Pooling**: Use PgBouncer or similar
2. **Query Optimization**: Analyze slow queries regularly
3. **Partitioning**: Consider partitioning large tables (audit_logs)
4. **Caching**: Use Redis for frequently accessed data
5. **Read Replicas**: For read-heavy workloads

## Monitoring

### Key Metrics to Monitor
- Database connection count
- Query performance (slow queries)
- Table sizes and growth
- Index usage
- Lock contention
- Replication lag (if using replicas)

### Recommended Tools
- PostgreSQL's `pg_stat_statements` extension
- `pgAdmin` for administration
- Custom monitoring dashboards
- Alerting on critical metrics

