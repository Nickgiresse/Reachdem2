-- Migration pour ajouter le statut aux projets
-- Créer l'enum ProjectStatus
CREATE TYPE "ProjectStatus" AS ENUM ('PENDING', 'ACTIVE', 'SUSPENDED', 'REJECTED');

-- Ajouter la colonne status aux projets
ALTER TABLE "projects" ADD COLUMN "status" "ProjectStatus" NOT NULL DEFAULT 'PENDING';

-- Mettre à jour les projets existants pour qu'ils soient ACTIVE par défaut
UPDATE "projects" SET "status" = 'ACTIVE' WHERE "status" = 'PENDING';
