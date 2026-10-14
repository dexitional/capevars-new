import { defineHandler } from "nitro";
import { handleFileRequest } from "./file-server";

// GET/HEAD /files/** - uploads in local storage. A Nitro handler for the
// same reasons as /img (img-handler.ts): it skips the router, and in dev Nitro
// only hands browser image/video requests to explicitly registered routes.
export default defineHandler((event) => handleFileRequest(event.req));
