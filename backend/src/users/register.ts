import { Database } from "../database/Database.ts";
import { error, ok, Result } from "../utils/result.ts";
import { emailSyntaxValid } from "../utils/validators.ts";

export type RegisterRequest = {
    username: string;
    email: string;
};

export type RegisterResponse = Result<
    void,
    | "server error"
    | "invalid username"
    | "invalid email"
    | "username taken"
    | "email taken"
>;

export async function register(
    request: RegisterRequest,
    db: Database,
): Promise<RegisterResponse> {
    const usernameValidResult = await usernameValid(request.username, db);
    if (!usernameValidResult.ok) {
        return usernameValidResult;
    }
    const emailValidResult = await emailVaid(request.email, db);
    if (!emailValidResult.ok) {
        return emailValidResult;
    }
    throw new Error("not implemented");
}

export async function usernameValid(
    username: string,
    db: Database,
): Promise<
    Result<void, "server error" | "invalid username" | "username taken">
> {
    if (username === "") {
        return error("invalid username");
    }
    const userWithUsernameExistsResult = await db.userWithUsernameExists(
        username,
    );
    if (!userWithUsernameExistsResult.ok) {
        return error("server error");
    }
    if (userWithUsernameExistsResult.value) {
        return error("username taken");
    }
    return ok(undefined);
}

export async function emailVaid(
    email: string,
    db: Database,
): Promise<Result<void, "server error" | "invalid email" | "email taken">> {
    if (email === "" || !emailSyntaxValid(email)) {
        return error("invalid email");
    }
    const userWithEmailExistsResult = await db.userWithEmailExists(email);
    if (!userWithEmailExistsResult.ok) {
        return error("server error");
    }
    if (userWithEmailExistsResult.value) {
        return error("email taken");
    }
    return ok(undefined);
}
