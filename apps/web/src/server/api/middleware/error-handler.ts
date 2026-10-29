import type { ErrorHandler } from "hono";
import { HTTPException } from "hono/http-exception";

export class AppError extends Error {
  constructor(
    message: string,
    public readonly status: 400 | 401 | 403 | 404 | 405 | 409 | 422 | 429 = 400,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export const errorHandler: ErrorHandler = (err, c) => {
  if (err instanceof HTTPException) {
    return err.getResponse();
  }

  if (err instanceof AppError) {
    return c.json({ error: err.message }, err.status);
  }

  console.error(err);
  // Node can report refused localhost connections as an AggregateError with
  // an empty message. Give SSR loaders a useful error to serialize.
  if ("code" in err && err.code === "ECONNREFUSED") {
    return c.json(
      {
        error:
          process.env.NODE_ENV === "development"
            ? "Could not connect to a required service (ECONNREFUSED). Check that MySQL is running and DATABASE_URL is correct."
            : "Service temporarily unavailable. Please try again shortly.",
      },
      503,
    );
  }
  return c.json({ error: "Internal server error" }, 500);
};
