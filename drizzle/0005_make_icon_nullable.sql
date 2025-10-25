-- Make icon column nullable in partners table
ALTER TABLE "partners" ALTER COLUMN "icon" DROP NOT NULL;

