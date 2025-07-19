import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

let POST, GET;

try {
  ({ POST, GET } = toNextJsHandler(auth));
} catch (error) {
  console.error("Erreur Better Auth:", error);
  // Vous pouvez aussi renvoyer une réponse personnalisée ici si besoin
}

export { POST, GET };

