import { assertEquals } from "std/testing/asserts.ts";
import { describe, it } from "std/testing/bdd.ts";
import { MockDatabase } from "../database/MockDatabase.ts";
import { asError, asOk } from "../utils/result.ts";
import { register, RegisterRequest } from "./register.ts";

export const testRequest = (): RegisterRequest => ({
    username: "John Doe",
    email: "johndoe@mail.com",
});

describe("register", () => {
    it("should return invalid username, when empty", async () => {
        const db = new MockDatabase();
        const response = await register({
            ...testRequest(),
            username: "",
        }, db);
        assertEquals(response.ok, false);
        assertEquals(asError(response).error, "invalid username");
    });

    it("should return invalid email, when empty", async () => {
        const db = new MockDatabase();
        const response = await register({
            ...testRequest(),
            email: "",
        }, db);
        assertEquals(response.ok, false);
        assertEquals(asError(response).error, "invalid email");
    });

    it("should return invalid email, when malformed", async () => {
        const db = new MockDatabase();
        const response = await register({
            ...testRequest(),
            email: "i nvali @@ d. asdasdasdasd",
        }, db);
        assertEquals(response.ok, false);
        assertEquals(asError(response).error, "invalid email");
    });

    it("should return username taken", async () => {
        const db = new MockDatabase();
        await db.addUser({
            id: asOk(await db.uniqueUserId()).value,
            username: "john",
            email: "test@email.com",
        });
        const response = await register({
            ...testRequest(),
            username: "john",
        }, db);
        assertEquals(response.ok, false);
        assertEquals(asError(response).error, "username taken");
    });

    it("should return email taken", async () => {
        const db = new MockDatabase();
        await db.addUser({
            id: asOk(await db.uniqueUserId()).value,
            username: "john",
            email: "test@email.com",
        });
        const response = await register({
            ...testRequest(),
            email: "test@email.com",
        }, db);
        assertEquals(response.ok, false);
        assertEquals(asError(response).error, "email taken");
    });
});
