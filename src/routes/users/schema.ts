import { createRoute, z } from "@hono/zod-openapi";

import type { Prisma } from "@prisma/client";

import { resErrorSchema } from "@/routes/schema";

export type User = Prisma.UserGetPayload<{}>;

/**
 * ユーザー作成時のリクエストボディ
 */
export const reqCreateUserSchema = z
  .object({
    name: z.string().min(1).openapi({
      description: "ユーザーの名前",
      example: "tarou",
    }),
    age: z.number().openapi({
      description: "ユーザーの年齢",
      example: 15,
    }),
  })
  .openapi("reqCreateUserSchema");

/**
 * ユーザー情報を返すスキーマ
 */
export const resUserSchema = z
  .object({
    id: z.number().openapi({
      description: "ユーザーのID",
      example: 1,
    }),
    name: z.string().openapi({
      description: "ユーザーの名前",
      example: "tarou",
    }),
    age: z.number().openapi({
      description: "ユーザーの年齢",
      example: 15,
    }),
  })
  .openapi("resUserSchema");

/**
 * ユーザー作成時のルーティング
 */
export const createUserRoute = createRoute({
  method: "post",
  path: "/api/users",
  request: {
    body: {
      content: {
        "application/json": {
          schema: reqCreateUserSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "ユーザー情報を返す",
      content: {
        "application/json": {
          schema: resUserSchema,
        },
      },
    },
    400: {
      description: "リクエストエラー",
      content: {
        "application/json": {
          schema: resErrorSchema,
        },
      },
    },
  },
});
