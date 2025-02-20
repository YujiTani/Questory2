import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";

import { requireAuth } from "@/middlewares/auth";
import { apiRoute } from "@/routes/route";

const app = new OpenAPIHono();

// 一旦すべての/api/*に認証をかける
app.use("/api/*", requireAuth);
app.route("/api", apiRoute);

app.doc31("/doc", {
  openapi: "3.1.0",
  info: {
    version: "1.0.0",
    title: "Sample API Document",
  },
});
app.get("/ui", swaggerUI({ url: "/doc" }));

export default app;
