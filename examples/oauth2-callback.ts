// Copyright 2021 Twitter, Inc.
// SPDX-License-Identifier: Apache-2.0

import { config } from "std/dotenv/mod.ts";
import { cleanEnv, str } from "envalid";
import { Application, Router } from "oak";
import { auth, Client } from "../src/mod.ts";

await config({ export: true });

const env = cleanEnv(Deno.env.toObject(), {
  CLIENT_ID: str(),
  CLIENT_SECRET: str(),
});

const app = new Application();
const router = new Router();

const authClient = new auth.OAuth2User({
  client_id: env.CLIENT_ID,
  client_secret: env.CLIENT_SECRET,
  callback: "http://127.0.0.1:3000/callback",
  scopes: ["tweet.read", "users.read"],
});

const client = new Client(authClient);

const STATE = "my-state";

router.get("/callback", async (ctx) => {
  try {
    const { code, state } = Object.fromEntries(
      ctx.request.url.searchParams.entries(),
    );
    if (state !== STATE) {
      ctx.response.status = 500;
      ctx.response.body = "State isn't matching";
      return;
    }
    await authClient.requestAccessToken(code);
    ctx.response.redirect("/tweets");
  } catch (error) {
    console.log(error);
  }
});

router.get("/login", async (ctx) => {
  const authUrl = await authClient.generateAuthURL({
    state: STATE,
    code_challenge_method: "s256",
  });
  ctx.response.redirect(authUrl);
});

router.get("/tweets", async (ctx) => {
  const tweets = await client.tweets.findTweetById("20");
  ctx.response.body = tweets.data;
});

router.get("/revoke", async (ctx) => {
  try {
    const response = await authClient.revokeAccessToken();
    ctx.response.body = response;
  } catch (error) {
    console.log(error);
  }
});

app.use(router.routes());
console.log(`Go here to login: http://127.0.0.1:3000/login`);
await app.listen({ port: 3000 });
