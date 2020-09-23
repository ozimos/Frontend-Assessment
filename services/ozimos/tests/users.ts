import App from "../src";
import "../src/env";
import request from "supertest";
import chai from "chai";
import faker from "faker";
import chaiSubset from "chai-subset";
import { users, userFactory } from "../test_helpers/seed";
import * as assert from "uvu/assert";
import "hard-rejection/register";
import { PrismaClient, usersCreateInput } from "@prisma/client";
import { suite } from "uvu";

console.log(process.env.TEST_DATABASE_URL);
const Users = suite("Users API");
chai.use(chaiSubset);
const { expect } = chai;

Users.before(async (context) => {
	// context.prisma = await beforeCallback();
	context.prisma = new PrismaClient();
	context.users = users;
	App.locals.prisma = context.prisma;
	await context.prisma.$queryRaw("DELETE from notes;");
	await context.prisma.$queryRaw("DELETE from users;");
	await Promise.all(
		context.users.map((data: Partial<usersCreateInput>) =>
			context.prisma.users.create({ data })
		)
	);
});

Users.after(async (context) => {
	await context.prisma.$queryRaw("DELETE from notes;");
	await context.prisma.$queryRaw("DELETE from users;");
	const count = await context.prisma.users.count();
	assert.is(count, 0);
});

Users("Create endpoint works as expected", async (context) => {
	const newUser = userFactory();
	await request(App)
		.post("/users/create")
		.send(newUser)
		.set("Accept", "application/json")
		.expect("Content-Type", /json/)
		.then((response) => {
			expect(response.body).to.containSubset(newUser);
		});
});

Users("Get endpoint works as expected", async (context) => {
	const {users: initUsers} = context
	const randomIndex = faker.random.number(initUsers.length - 1);
	const username = initUsers[randomIndex].username;
	await request(App)
		.get(`/users/${username}/notes`)
		.set("Accept", "application/json")
		.expect("Content-Type", /json/)
		.then((response) => {
			expect(response.body).to.containSubset(context.users.create);
		});
});

Users.run();
