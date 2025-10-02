import { auth } from "@/lib/auth";
import { headers } from "next/headers";

/**
 * Récupère l'utilisateur connecté depuis la session
 * @returns L'utilisateur connecté ou null si non authentifié
 */
export async function getCurrentUser() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    
    return session?.user || null;
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur:", error);
    return null;
  }
}

/**
 * Vérifie si l'utilisateur est authentifié
 * @returns true si authentifié, false sinon
 */
export async function isAuthenticated() {
  const user = await getCurrentUser();
  return user !== null;
}

/**
 * Middleware pour protéger les routes API
 * @param request La requête Next.js
 * @returns L'utilisateur connecté ou lance une erreur 401
 */
export async function requireAuth(request: Request) {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error("Non authentifié");
  }
  
  return user;
}
