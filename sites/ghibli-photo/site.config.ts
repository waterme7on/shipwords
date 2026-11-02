import { defineSite } from '@shipwords/core/site';

// Demo build: sign in, use the signup credit, generate. Checkout stays disabled until a Stripe test key is added.
// Price amounts are in the smallest currency unit (cents). Never change ids after launch.
export default defineSite({
  id: 'ghibliphoto',
  name: 'Ghibli Photo',
  url: 'https://ghibli.shipwords.yololab.cc',
  locales: ['en'],
  defaultLocale: 'en',
  products: [
    {
      id: 'pack_50',
      kind: 'credits',
      name: '5 scenes',
      price: { amount: 399, currency: 'usd' },
      credits: 50,
      expiresDays: null,
    },
    {
      id: 'pack_150',
      kind: 'credits',
      name: '15 scenes',
      price: { amount: 999, currency: 'usd' },
      credits: 150,
      expiresDays: null,
    },
  ],
  // Two free scenes per verified signup so the full flow works before payments are enabled.
  signup: { bonusCredits: 20, bonusExpiresDays: null, bonusPerIpDaily: 1, bonusSiteDaily: 20 },
  guest: { dailyPerDevice: 0, dailyPerIp: 0, dailySiteBudget: 0, minRecaptchaScore: 0.5 },
  billing: { provider: 'stripe', automaticTax: false },
  analytics: {},
});
