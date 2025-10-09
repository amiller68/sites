import "server-only";
import { QuotientServer } from "@quotientjs/server";

const QUOTIENT_PRIVATE_API_KEY = process.env.QUOTIENT_PRIVATE_API_KEY;

if (!QUOTIENT_PRIVATE_API_KEY) {
  throw new Error("QUOTIENT_PRIVATE_API_KEY is not set");
}

export const quotientClient = new QuotientServer({
  privateKey: QUOTIENT_PRIVATE_API_KEY,
  baseUrl: "https://www.getquotient.ai",
});
