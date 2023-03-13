import { User } from "../users/User.ts";
import { ok, Result as ResultType } from "../utils/result.ts";
import { Database, DatabaseError } from "./Database.ts";

type Result<T> = Promise<ResultType<T, DatabaseError>>;

export class MockDatabase implements Database {
    private users: User[] = [];
    private nextUserId = 0;

    public async userWithUsernameExists(username: string): Result<boolean> {
        return ok(
            this.users.find((user) => user.username === username) !== undefined,
        );
    }

    public async userWithEmailExists(email: string): Result<boolean> {
        return ok(
            this.users.find((user) => user.email === email) !== undefined,
        );
    }

    public async uniqueUserId(): Result<number> {
        return ok(this.nextUserId++);
    }

    public async addUser(user: User): Result<void> {
        this.users.push(user);
        return ok(undefined);
    }
}

export class MockDatabseError implements DatabaseError {
    public constructor(private message_: string) {}

    public message(): string {
        return this.message_;
    }
}
