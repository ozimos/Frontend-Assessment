import App from "../src";
import "../src/env";
import request from "supertest";
import * as assert from "uvu/assert";
import "hard-rejection/register";
import { PrismaClient } from "@prisma/client";
import { suite } from "uvu";

console.log(process.env.TEST_DATABASE_URL);
const Notes = suite("Notes API");

Notes.before(async (context) => {
	// context.prisma = await beforeCallback();
	context.prisma = new PrismaClient();
	App.locals.prisma = context.prisma;
	await context.prisma.queryRaw("DELETE from notes;");
});

Notes.after(async (context) => {
	await context.prisma.queryRaw("DELETE from notes;");
	const count = await context.prisma.notes.count();
	assert.is(count, 0);
});

Notes("Create endpoint works as expected", async (context) => {
	await request(App)
		.post("/notes/create")
		.send({
			title: "Sample notes",
			description: "This is a sample description",
		})
		.set("Accept", "application/json")
		.expect("Content-Type", /json/)
		.then((response) => {
			assert.is(response.body.title, "Sample notes");
		});
	const count = await context.prisma.notes.count();
	assert.is(count, 1);
});

Notes("Get all notes without author_id", async (context) => {
	const noAuthorId = await request(App)
		.get("/notes")
		.set("Accept", "application/json")
		.expect("Content-Type", /json/);
	// .set("Authorization",`Bearer ${jwtToken}`)
	// const isTrue = noAuthorId.some(note => {
	//   note.author_id !== null
	// })
	// assert.is(isTrue,true)
});

Notes("Update notes", async (context) => {
	const newNote = {
		title: "Testing creating note",
		description: "Added a description to placeholder descriptin text",
	};
	const updatedNote = {
		title: "Testing update note",
		description: "Added a description for the updated note",
	};

	const response = await request(App)
		.post("/notes/create")
		.send(newNote)
		.set("Accept", `application/json`)
		// .set("Authorization",`Bearer ${jwtToken}`)
		.expect("Content-Type", /json/)
		.then((data) => {
			return (
				request(App)
					.put(`/notes/${data.body.id}`)
					.send(updatedNote)
					.set("Accept", "application/json")
					// .set("Authorization",`Bearer ${jwtToken}`)
					.expect("Content-Type", /json/)
			);
		});
	assert.is(response.body.description, updatedNote.description);
	assert.is(response.body.title, updatedNote.title);
});

Notes("Delete notes", async (context) => {
	const newNote = {
		title: "Testing creating note",
		description: "Added a description to placeholder descriptin text",
	};

	const response = await request(App)
		.post("/notes/create")
		.send(newNote)
		.set("Accept", `application/json`)
		// .set("Authorization",`Bearer ${jwtToken}`)
		.expect("Content-Type", /json/)
		.then((data) => {
			return (
				request(App)
					.delete(`/notes/${data.body.id}`)
					.set("Accept", "application/json")
					// .set("Authorization",`Bearer ${jwtToken}`)
					.expect("Content-Type", /json/)
			);
		});

	assert.is(response.body.description, newNote.description);
	assert.is(response.body.title, newNote.title);
});

Notes.run();
