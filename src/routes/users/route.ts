import { OpenAPIHono } from "@hono/zod-openapi";

import { createUserRoute } from "@/routes/users/schema";
import { createUser } from "@/usecases/users.usecase";

export const userRoute = new OpenAPIHono()
  .openapi(createUserRoute, async (c) => {
    const { name, age } = c.req.valid("json");
    // repository
    const user = await createUser(name, age);
    return c.json(user, 200);
  })
  .get("/", (c) => c.json({ message: "users fetched" }));

export type UserRouteType = typeof userRoute;
