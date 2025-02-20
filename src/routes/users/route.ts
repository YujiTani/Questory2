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
  // TODO: DBのユーザー取得処理を実装してから
  .get("/", async (c) =>
    // const user = c.get("user");
    // assert(user, new HTTPException(401, { message: "Authentication required" }));
    // const dbUser = getUser(user.userId);
    // dbUser ??= await insertUser(user.userId);

    // const userIdentifiers = await getUserIdentifiers(user.userId);
    //  c.json({
    //     user: dbUser,
    //     identifiers: userIdentifiers.identifiers,
    // })
    c.json({ message: "Hello, World!" }),
  );

export type UserRouteType = typeof userRoute;
