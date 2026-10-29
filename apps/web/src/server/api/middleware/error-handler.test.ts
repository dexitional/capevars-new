import assert from "node:assert/strict";
import { test } from "node:test";
import { Hono } from "hono";
import { AppError, errorHandler } from "./error-handler";

test("an empty connection error becomes an actionable development response", async (t) => {
  const previous = process.env.NODE_ENV;
  process.env.NODE_ENV = "development";
  t.after(() => {
    if (previous === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = previous;
  });
  t.mock.method(console, "error", () => {});
  const app = new Hono().onError(errorHandler).get("/", () => {
    throw Object.assign(new AggregateError([]), { code: "ECONNREFUSED" });
  });

  const response = await app.request("/");
  assert.equal(response.status, 503);
  assert.match((await response.json()).error, /MySQL is running/);
});

test("production connection failures do not expose configuration details", async (t) => {
  const previous = process.env.NODE_ENV;
  process.env.NODE_ENV = "production";
  t.after(() => {
    if (previous === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = previous;
  });
  t.mock.method(console, "error", () => {});
  const app = new Hono().onError(errorHandler).get("/", () => {
    throw Object.assign(new Error("private database address"), { code: "ECONNREFUSED" });
  });

  const response = await app.request("/");
  assert.equal(response.status, 503);
  assert.deepEqual(await response.json(), {
    error: "Service temporarily unavailable. Please try again shortly.",
  });
});

test("unrelated failures keep their existing status and public message", async (t) => {
  t.mock.method(console, "error", () => {});
  const app = new Hono().onError(errorHandler)
    .get("/unexpected", () => { throw new Error("private query details"); })
    .get("/validation", () => { throw new AppError("Choose a valid photo.", 422); });

  const unexpected = await app.request("/unexpected");
  assert.equal(unexpected.status, 500);
  assert.deepEqual(await unexpected.json(), { error: "Internal server error" });
  const validation = await app.request("/validation");
  assert.equal(validation.status, 422);
  assert.deepEqual(await validation.json(), { error: "Choose a valid photo." });
});
