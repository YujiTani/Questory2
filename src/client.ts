import { hc } from "hono/client";

import type { UserRouteType } from "@/routes/users/route";

const client = hc<UserRouteType>("http://localhost:3000/");

const res = await client.api.users.$post({
  json: {
    name: "tarou",
    age: 15,
  },
});

if (res.ok) {
  const user = await res.json();
  console.log(res.status, "post success", user);
} else {
  console.log(res.status, "post error");
}
