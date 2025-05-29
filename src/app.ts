import { env } from "node:process";

import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import Fastify from "fastify";
import fastifyCors from "@fastify/cors";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import assert from "node:assert";

import publicRouter from "./routers/public.router";

const { PORT, MONGODB_URL } = env;

const app = Fastify().withTypeProvider<TypeBoxTypeProvider>();

async function build() {
	assert(MONGODB_URL, "MONGODB_URL is not set");

	await mongoose.connect(MONGODB_URL)
		.then(() => console.log("Connected to MongoDB"));

	await app.register(fastifyCors, {
		origin: "http://127.0.0.1:5500",
		credentials: true
	});

	await app.register(publicRouter, { prefix: "/p" });
}

build()
	.then(() => app.listen({ port: Number(PORT) || 5050, host: "0.0.0.0" }))
	.then(at => console.log("Server started at", at));