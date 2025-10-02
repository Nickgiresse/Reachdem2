-- Migration pour ajouter user_id aux groupes
-- Étape 1: Ajouter la colonne user_id comme nullable d'abord
ALTER TABLE "groups" ADD COLUMN "user_id" TEXT;

-- Étape 2: Assigner les groupes existants au premier utilisateur disponible
-- ou créer un utilisateur par défaut si aucun n'existe
DO $$
DECLARE
    default_user_id TEXT;
BEGIN
    -- Récupérer le premier utilisateur existant
    SELECT id INTO default_user_id FROM "user" LIMIT 1;
    
    -- Si aucun utilisateur n'existe, créer un utilisateur par défaut
    IF default_user_id IS NULL THEN
        INSERT INTO "user" (id, email, name, "emailVerified", "createdAt", "updatedAt")
        VALUES ('default-user-id', 'default@example.com', 'Utilisateur par défaut', false, NOW(), NOW())
        RETURNING id INTO default_user_id;
    END IF;
    
    -- Assigner tous les groupes existants à cet utilisateur
    UPDATE "groups" SET "user_id" = default_user_id WHERE "user_id" IS NULL;
END $$;

-- Étape 3: Rendre la colonne user_id obligatoire
ALTER TABLE "groups" ALTER COLUMN "user_id" SET NOT NULL;

-- Étape 4: Ajouter la contrainte de clé étrangère
ALTER TABLE "groups" ADD CONSTRAINT "groups_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
