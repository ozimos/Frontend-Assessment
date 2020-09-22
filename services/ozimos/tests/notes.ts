import App from "../src";
import "../src/env";
import request from "supertest";
import chai from "chai";
import faker from "faker";
import chaiSubset from "chai-subset";
import { anonymousNotes, noteFactory } from "./seed";
import * as assert from "uvu/assert";
import "hard-rejection/register";
import { PrismaClient } from "@prisma/client";
import { suite } from "uvu";
import { notes } from "@prisma/client";
import cuid from "cuid";

console.log(process.env.TEST_DATABASE_URL);
const Notes = suite("Notes API");
chai.use(chaiSubset);
const { expect } = chai;

Notes.before(async (context) => {
	// context.prisma = await beforeCallback();
	context.prisma = new PrismaClient();
	context.anonNotes = anonymousNotes;
	context.deletionNote = noteFactory({ id: cuid() });
	App.locals.prisma = context.prisma;
	await context.prisma.$queryRaw("DELETE from notes;");
	await Promise.all(
		context.anonNotes.map((data: Partial<notes>) =>
			context.prisma.notes.create({ data })
		)
	);
	await context.prisma.notes.create({ data: context.deletionNote });
});

Notes.after(async (context) => {
	await context.prisma.$queryRaw("DELETE from notes;");
	const count = await context.prisma.notes.count();
	assert.is(count, 0);
});

Notes("Create endpoint works as expected", async (context) => {
	const createNote = noteFactory();
	await request(App)
		.post("/notes/create")
		.send(createNote)
		.set("Accept", "application/json")
		.expect("Content-Type", /json/)
		.then((response) => {
			expect(response.body).to.containSubset(createNote);
		});
});

Notes("Get endpoint works as expected", async (context) => {
	await request(App)
		.get("/notes")
		.set("Accept", "application/json")
		.expect("Content-Type", /json/)
		.then((response) => {
			expect(response.body).to.containSubset(context.anonNotes);
		});
});

Notes("Put endpoint works as expected", async (context) => {
	const { anonNotes } = context;
	const updatedNote = noteFactory();
	const randomIndex = faker.random.number(anonNotes.length - 1);
	const noteId = anonNotes[randomIndex].id;
	await request(App)
		.put(`/notes/${noteId}-id`)
		.send(updatedNote)
		.set("Accept", "application/json")
		.expect("Content-Type", /json/)
		.then((response) => {
			expect(response.body).to.containSubset(updatedNote);
		});
});

Notes("Delete endpoint works as expected", async (context) => {
	const noteId = context.deletionNote.id;
	await request(App)
		.delete(`/notes/${noteId}-id`)
		.set("Accept", "application/json")
		.expect("Content-Type", /json/)
		.then((response) => {
			expect(response.body).to.containSubset(context.deleteNote);
		});
});

Notes.run();
