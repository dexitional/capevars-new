import { defineHandler } from "nitro";
import { handleOgImage } from "./seo";

export default defineHandler((event) => handleOgImage(event.req as Request));
