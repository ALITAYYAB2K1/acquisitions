import arcjet, {
  shield,
  detectBot,
  tokenBucket,
  slidingWindow,
} from '@arcjet/node';

const aj = arcjet({
  key: process.env.ARCJET_KEY,
  rules: [
    // Shield protects your app from common attacks e.g. SQL injection
    shield({ mode: 'LIVE' }),
    // Create a bot detection rule
    detectBot({
      mode: 'LIVE', // Blocks requests. Use "DRY_RUN" to log only
      // Block all bots except the following
      allow: [
        'CATEGORY:SEARCH_ENGINE', // Google, Bing, etc
        // Uncomment to allow these other common bot categories
        // See the full list at https://arcjet.com/bot-list
        //"CATEGORY:MONITOR", // Uptime monitoring services
        'CATEGORY:PREVIEW', // Link previews e.g. Slack, Discord
      ],
    }),
    slidingWindow({
      // Tracked by IP address by default, but this can be customized
      // See https://docs.arcjet.com/fingerprints
      //characteristics: ["ip.src"],
      mode: 'LIVE',
      interval: '10s',
      max: 10,
    }),
    // Create a token bucket rate limit. Other algorithms are supported.
    tokenBucket({
      mode: 'LIVE',
      refillRate: 5,
      interval: 10,
      capacity: 10,
    }),
  ],
});
export default aj;
