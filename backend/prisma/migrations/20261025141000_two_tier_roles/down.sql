-- Reversible down migration for two_tier_roles
ALTER TABLE "user_roles" DROP CONSTRAINT IF EXISTS check_user_role;
ALTER TABLE "user_roles" DROP COLUMN IF EXISTS "is_protected";
