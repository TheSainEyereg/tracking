import crypto from "node:crypto";

export const randomHexString = (bytes: number) => crypto.randomBytes(bytes).toString("hex");

export const sha1 = (data: string) => crypto.createHash("sha1").update(data).digest("hex");

export const decryptAes = (b64data: string, hexKey: string) => {
	const key = Buffer.from(hexKey, "hex");
	const data = Buffer.from(b64data, "latin1");

	const iv = data.subarray(0, 16);
	const encrypted = data.subarray(16);

	const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
	const decrypted = decipher.update(encrypted);
	return decrypted.toString();
}