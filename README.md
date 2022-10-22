# Twi [![Deno](https://shield.deno.dev/x/twi)](https://deno.land/x/twi) [![v2](https://img.shields.io/endpoint?url=https%3A%2F%2Ftwbadges.glitch.me%2Fbadges%2Fv2)](https://developer.twitter.com/en/docs/twitter-api)

> Twitter API client for Deno ported from
> [twitter-api-typescript-sdk](https://github.com/twitterdev/twitter-api-typescript-sdk).

## Example

```js
import { Client } from "https://deno.land/x/twi/mod.ts";

const client = new Client("BEARER_TOKEN");

const stream = client.tweets.sampleStream({
  "tweet.fields": ["author_id"],
});
for await (const tweet of stream) {
  console.log(tweet.data?.author_id);
}
```

Check out [examples/](./examples) for more examples or see
[this real-word bot](https://github.com/roj1512/rtwtrbt).
