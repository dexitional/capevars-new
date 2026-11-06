import { defineHandler } from "nitro";
import { handleSitemap } from "./seo";

export default defineHandler((event) => handleSitemap(event.req as Request));
