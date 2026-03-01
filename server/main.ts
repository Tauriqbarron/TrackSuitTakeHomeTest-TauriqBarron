// deno-lint-ignore-file no-explicit-any
import { Database } from "@db/sqlite";
import * as oak from "@oak/oak";
import * as path from "@std/path";
import { Port } from "../lib/utils/index.ts";
import listInsights from "./operations/list-insights.ts";
import lookupInsight from "./operations/lookup-insight.ts";
import createInsights from "./operations/create-insight.ts";
import { createTable, type Insert } from "$tables/insights.ts";
import deleteInsight from "./operations/delete-insight.ts";

console.log("Loading configuration");

const env = {
  port: Port.parse(Deno.env.get("SERVER_PORT")),
};

const dbFilePath = path.resolve("tmp", "db.sqlite3");

console.log(`Opening SQLite database at ${dbFilePath}`);

await Deno.mkdir(path.dirname(dbFilePath), { recursive: true });
const db = new Database(dbFilePath);

console.log("Ensuring insights table exists");
db.exec(createTable);

console.log("Initialising server");

const router = new oak.Router();

router.get("/_health", (ctx) => {
  ctx.response.body = "OK";
  ctx.response.status = 200;
});

router.get("/insights", (ctx) => {
  const result = listInsights({ db });
  ctx.response.body = result;
  ctx.response.status = 200;
});

router.get("/insights/:id", (ctx) => {
  const params = ctx.params as Record<string, any>;
  const result = lookupInsight({ db, id: params.id });
  ctx.response.body = result;
  ctx.response.status = 200;
});

router.post("/insights/create", async (ctx) => {
  const requestBody = await ctx.request.body.json() as Insert;
  const result = createInsights({ db }, requestBody);
  if (!result.success) {
    ctx.response.status = 400;
    ctx.response.body = { error: result.message };
    return;
  }
  ctx.response.status = 201;
});

router.delete("/insights/delete", (ctx) => {
  const idparam = ctx.request.url.searchParams.get("id");
  if (!idparam) {
    ctx.response.status = 400;
    ctx.response.body = { error: "Missing id parameter" };
    return;
  }
  const id = Number(idparam);
  const result = deleteInsight({ db }, id);
  if (!result.success) {
    ctx.response.status = 400;
    ctx.response.body = { error: result.message };
    return;
  }
  ctx.response.status = 204;
});

const app = new oak.Application();

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(env);
console.log(`Started server on port ${env.port}`);
