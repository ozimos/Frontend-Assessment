import faker from "faker";
import cuid from "cuid";
import { users } from "@prisma/client";

function userFactory(defaults: any = {}) {
	return {
		username: faker.name.firstName(),
		...defaults,
	};
}

const noteFactory = (defaults: Partial<users> | any = {}) => ({
	title: faker.random.words(faker.random.number({ max: 4, min: 2 })),
	description: faker.lorem.sentence(),
	...defaults,
});

const notesArr = (length: number) =>
	Array.from({ length }, () => noteFactory({ id: cuid() }));

const anonymousNotes = notesArr(4);

const usersArr = (length: number) =>
	Array.from({ length }, () =>
		userFactory({
			id: cuid(),
			notes: { create: notesArr(2) },
		})
	);

const users = usersArr(2);

export { anonymousNotes, users, noteFactory };
