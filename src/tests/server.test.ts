// import { testClient } from "hono/testing";

// import type { UserRouteType } from "@/routes/users/route";

// import app from "@/server";

// descri("APIテスト", () => {
//   it("ユーザー作成 正常系 ", async () => {
//     const client = testClient<UserRouteType>(app);
//     const res = await client.api.users.$post({
//       json: {
//         name: "tarou",
//         age: 15,
//       },
//     });
//     expect(res.status).toBe(200);
//   });

//   it("ユーザー作成 異常系 ", async () => {
//     const client = testClient<UserRouteType>(app);
//     const res = await client.api.users.$post({
//       json: {
//         // @ts-ignore 型チェックを無視
//         name: null,
//         age: 15,
//       },
//     });
//     expect(res.status).toBe(400);
//   });
// });
