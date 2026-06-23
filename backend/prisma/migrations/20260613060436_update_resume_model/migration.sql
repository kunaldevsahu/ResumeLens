-- AlterTable
ALTER TABLE "Resume" ADD COLUMN     "education" JSONB,
ADD COLUMN     "experience" JSONB,
ADD COLUMN     "projects" JSONB,
ADD COLUMN     "skills" TEXT,
ADD COLUMN     "summary" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE "Resume" ALTER COLUMN "updatedAt" DROP DEFAULT;
