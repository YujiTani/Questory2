import { OpenAPIHono } from "@hono/zod-openapi";

import { userRoute } from "@/routes/users/index";

export const apiRoute = new OpenAPIHono();

apiRoute.route("/users", userRoute);

export type AppType = typeof apiRoute;
