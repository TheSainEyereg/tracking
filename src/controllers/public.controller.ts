import assert from "node:assert";
import { env } from "node:process";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { FastifyReply, FastifyRequest } from "fastify";
import { obfuscate } from "javascript-obfuscator";

import { decryptAes, randomHexString } from "../utils/crypto.util";
import { getTempData, saveTempData } from "../utils/cache.util";

import App from "../models/App.model";
import Visitor from "../models/Visitor.model";

export const serveJs = async (request: FastifyRequest<{
	Params: {
		clientId: string
	}
}>, reply: FastifyReply) => {
	const { params: { clientId }, headers: { "user-agent": userAgent, "accept-language": acceptLanguage }, client: { ip } } = request;

	if (!userAgent)
		return reply.status(403).send(); // Dont give them a clue about what they need to do

	const app = await App.findOne({ clientId });
	if (!app)
		return reply.status(404).send({ message: "App not found" });

	const tempKey = randomHexString(32);
	const postUrl = `${env.PUBLIC_URL}/p/${clientId}`;

	const path = join(__dirname, "../../public");
	const libsPath = join(path, "libs");
	let content = "";

	for (const file of await readdir(libsPath))
		content += (await readFile(join(libsPath, file))).toString();

	const setup = (await readFile(join(path, "setup.js")))
		.toString()
		.replace("{{POST_URL}}", postUrl)
		.replace("{{KEY}}", tempKey);
	
	const payload = await readFile(join(path, "script.js"));

	content += obfuscate(`(async () => {\n${setup}\n${payload}})()`, {
		compact: true,
		identifierNamesGenerator: "hexadecimal"
	}).getObfuscatedCode();

	saveTempData({ ip, userAgent }, tempKey);

	reply.header("Content-Type", "text/javascript");
	reply.send(content);
}

export const acceptData = async (request: FastifyRequest<{
	Params: {
		clientId: string;
	}
	Body: string;
}>, reply: FastifyReply) => {
	const { body, params: { clientId }, headers: { "user-agent": userAgent, "accept-language": acceptLanguage }, client: { ip } } = request;

	if (!userAgent)
		return reply.status(403).send();

	const app = await App.findOne({ clientId });
	if (!app)
		return reply.status(404).send({ message: "App not found" });

	const { tempKey } = getTempData({ ip, userAgent }) ?? {};

	if (!tempKey)
		return reply.status(403).send();

	const data = decryptAes(body, tempKey);

	console.log("Data", data);
}