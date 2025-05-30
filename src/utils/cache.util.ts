// ToDo: use Redis

import { sha1 } from "./crypto.util";

interface ClientData {
	userAgent: string;
	ip: string;
	tempKey: string;
	expiresTimer: NodeJS.Timeout;
}

interface IdentData {
	ip: string;
	userAgent: string
}

const cache = new Map<string, ClientData>();

export const saveTempData = (data: IdentData, tempKey: string) => {
	const { ip, userAgent } = data;
	const hash = sha1(`${ip}${userAgent}`);

	cache.set(hash, {
		userAgent,
		ip,
		tempKey,
		expiresTimer: setTimeout(() => {
			cache.delete(tempKey);
		}, 10000)
	});
};

export const getTempData = (data: IdentData) => {
	const { ip, userAgent } = data;
	const hash = sha1(`${ip}${userAgent}`);

	return cache.get(hash);
};