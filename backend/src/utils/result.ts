export type Result<T, E> = OkResult<T> | ErrorResult<E>;

export type OkResult<T> = { ok: true; value: T };

export type ErrorResult<E> = { ok: false; error: E };

export const ok = <T>(
    value: T,
): OkResult<T> => ({ ok: true, value });

export const error = <E>(
    error: E,
): ErrorResult<E> => ({ ok: false, error });

export const asOk = <T, E>(result: Result<T, E>) => result as OkResult<T>;
export const asError = <T, E>(result: Result<T, E>) => result as ErrorResult<E>;
