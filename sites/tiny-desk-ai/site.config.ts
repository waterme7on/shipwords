import { defineSite } from '@shipwords/core/site';

// The source of tinydeskai.io, open-sourced as a complete shipwords example. url is a placeholder: set your own domain.
// All config for this site. Price amounts are in the smallest currency unit (cents). Never change ids after launch.
// Demo build: sign in, use the signup credit, generate. Payments are disabled until the Stripe test key is added.
export default defineSite({
  id: 'tinydeskaiyolo',
  name: 'Tiny Desk AI',
  url: 'https://app.shipwords.yololab.cc',
  locales: ['en'],
  defaultLocale: 'en',
  // Same price for 1–5 people; one video = 10 credits. Each video costs about $3.06 upstream (Kling 4.0, 720p, one run).
  products: [
    {
      id: 'video_1',
      kind: 'credits',
      name: '1 video',
      price: { amount: 998, currency: 'usd' },
      credits: 10,
      expiresDays: null,
    },
    {
      id: 'video_3',
      kind: 'credits',
      name: '3 videos',
      price: { amount: 2499, currency: 'usd' },
      credits: 30,
      expiresDays: null,
    },
    {
      id: 'video_10',
      kind: 'credits',
      name: '10 videos',
      price: { amount: 5999, currency: 'usd' },
      credits: 100,
      expiresDays: null,
    },
  ],
  // Demo build: two free videos per verified signup so the full flow is usable before payments are enabled.
  signup: { bonusCredits: 20, bonusExpiresDays: null, bonusPerIpDaily: 1, bonusSiteDaily: 20 },
  guest: { dailyPerDevice: 0, dailyPerIp: 0, dailySiteBudget: 0, minRecaptchaScore: 0.5 },
  billing: { provider: 'stripe', automaticTax: false },
  analytics: {},
});
