import "server-only";
import { QuotientServer } from "@quotientjs/server";

const QUOTIENT_PRIVATE_API_KEY = process.env.QUOTIENT_PRIVATE_API_KEY;

// Allow build to succeed without key - API calls will fail at runtime if missing
export const quotientClient = new QuotientServer({
  privateKey: QUOTIENT_PRIVATE_API_KEY || "missing-key",
  baseUrl: "https://www.getquotient.ai",
});
