-- AlterTable
ALTER TABLE "User" ADD COLUMN "passwordHash" TEXT;

UPDATE "User"
SET "passwordHash" = "password"
WHERE "passwordHash" IS NULL
  AND "password" IS NOT NULL;

ALTER TABLE "User"
ALTER COLUMN "passwordHash" SET NOT NULL,
DROP COLUMN "password";
