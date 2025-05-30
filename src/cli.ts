import { stdin, stdout, env } from "node:process";
import assert from "node:assert";
import { createInterface } from "node:readline";

import mongoose from "mongoose";
import dotenv from "dotenv";
import { randomHexString } from "./utils/crypto.util";

import App from "./models/App.model";

dotenv.config();

const rl = createInterface({
	input: stdin,
	output: stdout
});

const ask = (question: string) => new Promise<string>((resolve, reject) => {
	rl.question(question, resolve);
});

const apps = async (mode: string, name?: string) => {
	// "list"|"add"|"remove"|"get"
	assert(["list", "add", "remove", "get"].includes(mode), "Invalid mode");


	switch (mode) {
		case "list": {
			const list = await App.find().then(l => l.map(a => a.name).join("\n"));

			console.log(list || "No apps found");
			break;
		}
		case "add": {
			assert(name, "Name is required");

			const exists = await App.findOne({ name });
			assert(!exists, "App already exists");

			const clientId = randomHexString(64);
			const clientSecret = randomHexString(128);
			const ipsString = await ask("IPs (separated by space, leave empty for all): ");

			const ips = ipsString ? ipsString.split(" ") : undefined;
			await App.create({ name, clientId, clientSecret, ips });

			console.log("App created");
			console.log("Client ID:", clientId);
			console.log("Client Secret:", clientSecret);
			break;
		}
		case "remove": {
			assert(name, "Name is required");

			await App.deleteOne({ name });
			break;
		}
		case "get": {
			const app = await App.findOne({ name });

			assert(app, "App not found");

			console.log("App:", app);
			console.log("Client ID:", app.clientId);
			console.log("Client Secret:", app.clientSecret);
			console.log("IPs:", app.ips);

			break;
		}
	}
}

assert(env.MONGODB_URL, "MONGODB_URL is not set");

mongoose.connect(env.MONGODB_URL)
	.then(async () => {
		const [,, ...args] = process.argv;

		switch (args[0]) {
			case "apps":
				const [mode, name] = args.slice(1);
				await apps(mode, name);
				break;
			default:
				console.log("Invalid command");
				break;
		}
	})
	.finally(() => mongoose.disconnect())
	.finally(() => rl.close());