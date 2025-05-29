import assert from "node:assert";
import { env } from "node:process";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { FastifyReply, FastifyRequest } from "fastify";
import { randomString } from "../utils/crypto.util";
import { obfuscate } from "javascript-obfuscator";

import App from "../models/App.model";
import Visitor from "../models/Visitor.model";

export const serveJs = async (request: FastifyRequest<{
	Params: {
		clientId: string
	}
}>, reply: FastifyReply) => {
	const { params: { clientId } } = request;

	const app = await App.findOne({ clientId });
	if (!app)
		return reply.status(404).send({ message: "App not found" });

	const key = randomString(64);
	const postUrl = `${env.PUBLIC_URL}/p/${clientId}`;

	const path = join(__dirname, "../../public");

	const setup = (await readFile(join(path, "setup.js")))
		.toString()
		.replace("{{POST_URL}}", postUrl)
		.replace("{{KEY}}", key);

	const sha1 = await readFile(join(path, "sha1.js"));
	const aes = await readFile(join(path, "aes.js"));
	const script = await readFile(join(path, "script.js"));

	const content = `(async () => {\n${setup}\n${sha1}\n${aes}\n${script}\n})();`;
	const obfuscated = obfuscate(content, {
		compact: true,
		identifierNamesGenerator: "hexadecimal"
	}).getObfuscatedCode();

	reply.header("Content-Type", "text/javascript");
	reply.send(obfuscated);
}

export const acceptData = async (request: FastifyRequest, reply: FastifyReply) => {
	
}