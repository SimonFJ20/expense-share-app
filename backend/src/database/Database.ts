import { Result as ResultType } from "../utils/result.ts";

type Result<T> = Promise<ResultType<T, DatabaseError>>;

export interface Database {
    userWithUsernameExists(username: string): Result<boolean>;
    userWithEmailExists(email: string): Result<boolean>;
}

export interface DatabaseError {
    message(): string;
}
