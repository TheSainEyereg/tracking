import crypto from "node:crypto";

export const randomString = (chars: number) => crypto.randomBytes(chars / 2).toString("hex");