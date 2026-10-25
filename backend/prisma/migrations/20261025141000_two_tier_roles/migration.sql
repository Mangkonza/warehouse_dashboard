-- Migration: 2-tier role system (admin and user)
-- 1. Add is_protected to user_roles
ALTER TABLE "user_roles" ADD COLUMN IF NOT EXISTS "is_protected" BOOLEAN NOT NULL DEFAULT false;

-- 2. Migrate super_admin accounts to admin with is_protected = true
UPDATE "user_roles"
SET "role" = 'admin', "is_protected" = true
WHERE "username" IN ('b6520503525', 'b0123456789') OR "role" = 'super_admin';

-- 3. Remove management roles
DELETE FROM "user_roles" WHERE "role" = 'management';

-- 4. Add check constraint for role in ('admin', 'user')
ALTER TABLE "user_roles" DROP CONSTRAINT IF EXISTS check_user_role;
ALTER TABLE "user_roles" ADD CONSTRAINT check_user_role CHECK ("role" IN ('admin', 'user'));

-- 5. Insert audit log record for this migration
INSERT INTO "role_audit_logs" ("actor_username", "action", "target_username", "old_role", "new_role", "created_at")
VALUES ('system', 'migrate_to_2tier', 'system', 'super_admin/management', 'admin/user', NOW());
