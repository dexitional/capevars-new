// The Hono app instance, mounted at /api/* by routes/api/$.ts (which strips
// that prefix before calling .fetch() here).
import { Hono } from "hono";
import { corsMiddleware } from "./middleware/cors.js";
import { loggerMiddleware } from "./middleware/logger.js";
import { errorHandler } from "./middleware/error-handler.js";
import { authRoute } from "./modules/auth/route.js";
import { meRoute } from "./modules/me/route.js";
import { paymentsRoute } from "./modules/payments/route.js";
import { publicRoute } from "./modules/public/route.js";
import { marketRoute } from "./modules/market/route.js";
import { sellerRoute } from "./modules/seller/route.js";
import { ticketsRoute } from "./modules/tickets/route.js";
import { jobsRoute } from "./modules/jobs/route.js";
import { exhibitionsRoute } from "./modules/exhibitions/route.js";
import { finderRoute } from "./modules/finder/route.js";
import { groupsRoute } from "./modules/groups/route.js";
import { socialRoute } from "./modules/social/route.js";
import { chatRoute } from "./modules/chat/route.js";
import { learnRoute } from "./modules/learn/route.js";
import { kidiLearnRoute } from "./modules/kidilearn/route.js";
import { quizbankRoute } from "./modules/quizbank/route.js";
import { teachRoute } from "./modules/teach/route.js";
import { leadgenRoute } from "./modules/leadgen/route.js";
import { adminRoute } from "./modules/admin/route.js";
import { storageRoute } from "./modules/storage/route.js";
import { runBroadcastQueue, startBroadcastWorker } from "./lib/leadgen.js";

const app = new Hono();

app.use("*", loggerMiddleware);
app.use("*", corsMiddleware);
app.onError(errorHandler);

app.get("/health", (c) => c.json({ ok: true }));

app.route("/auth", authRoute);
app.route("/me", meRoute);
app.route("/payments", paymentsRoute);
app.route("/public", publicRoute);
app.route("/market", marketRoute);
app.route("/seller", sellerRoute);
app.route("/tickets", ticketsRoute);
app.route("/jobs", jobsRoute);
app.route("/exhibitions", exhibitionsRoute);
app.route("/finder", finderRoute);
app.route("/groups", groupsRoute);
app.route("/social", socialRoute);
app.route("/chat", chatRoute);
app.route("/learn/kidilearn", kidiLearnRoute);
app.route("/learn/quizbank", quizbankRoute);
app.route("/learn", learnRoute);
app.route("/teach", teachRoute);
app.route("/leadgen", leadgenRoute);
app.route("/admin", adminRoute);
app.route("/storage", storageRoute);

// LeadGen broadcasts are sent by an in-process worker; every server process
// polls the queue and claims broadcasts atomically, so cluster mode is safe.
startBroadcastWorker();
void runBroadcastQueue().catch((err) => console.error("broadcast worker:", err));

app.notFound((c) => c.json({ error: "Not found" }, 404));

export type AppType = typeof app;
export { app as apiApp };
