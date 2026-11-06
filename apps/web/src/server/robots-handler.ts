import { defineHandler } from "nitro";
import { handleRobots } from "./seo";

export default defineHandler((event) => handleRobots(event.req as Request));
