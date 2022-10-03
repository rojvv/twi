// Copyright 2021 Twitter, Inc.
// SPDX-License-Identifier: Apache-2.0

import { config } from "std/dotenv/mod.ts";
import { cleanEnv, str } from "envalid";
import { Client } from "../src/mod.ts";

await config({ export: true });

const env = cleanEnv(Deno.env.toObject(), {
  BEARER_TOKEN: str(),
});

const client = new Client(env.BEARER_TOKEN);
await client.tweets.addOrDeleteRules(
  {
    add: [
      { value: "cat has:media", tag: "cats with media" },
      { value: "cat has:media -grumpy", tag: "happy cats with media" },
      { value: "meme", tag: "funny things" },
      { value: "meme has:images" },
    ],
  },
);
const rules = await client.tweets.getRules();
console.log(rules);
const stream = client.tweets.searchStream({
  "tweet.fields": ["author_id", "geo"],
});
for await (const tweet of stream) {
  console.log(tweet.data?.author_id);
}
