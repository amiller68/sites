import { JaxClient } from "@repo/jax";

const MUSIC_BUCKET_ID = "f5a969c4-a3e2-43bc-9ab2-0e6343006d00";
const PHOTOS_BUCKET_ID = "f45fe1b0-8172-4619-b6c6-17518058ff16";
const GATEWAY = process.env.JAX_GATEWAY || "https://jax.alexplain.me";

export const jax = new JaxClient({
  gateway: GATEWAY,
  bucketId: MUSIC_BUCKET_ID,
});

export const photosJax = new JaxClient({
  gateway: GATEWAY,
  bucketId: PHOTOS_BUCKET_ID,
});
