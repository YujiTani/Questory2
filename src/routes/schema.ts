import { z } from "@hono/zod-openapi";

/**
 * エラーを返すスキーマ
 */
export const resErrorSchema = z
  .object({
    code: z.number().openapi({
      description: "エラーコード",
      example: 400,
    }),
    message: z.string().openapi({
      description: "エラーメッセージ",
      example: "Bad Request",
    }),
  })
  .openapi("resErrorSchema");
