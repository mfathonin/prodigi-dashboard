import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const compare = scryptSync(password, salt, 64);
  const digest = Buffer.from(hash, "hex");
  if (compare.length !== digest.length) return false;
  return timingSafeEqual(compare, digest);
}
