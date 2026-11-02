import { defineSite } from '@shipwords/core/site';

// Demo build: sign in, use the signup credit, generate. Checkout stays disabled until a Stripe test key is added.
// Price amounts are in the smallest currency unit (cents). Never change ids after launch.
export default defineSite({
  id: 'aibaby',
  name: 'AI Baby',
  url: 'https://baby.shipwords.yololab.cc',
  locales: ['en'],
  defaultLocale: 'en',
  products: [
    {
      id: 'pack_40',
      kind: 'credits',
      name: '4 portraits',
      price: { amount: 799, currency: 'usd' },
      credits: 40,
      expiresDays: null,
    },
    {
      id: 'pack_120',
      kind: 'credits',
      name: '12 portraits',
      price: { amount: 1999, currency: 'usd' },
      credits: 120,
      expiresDays: null,
    },
  ],
  // Two free portraits per verified signup so the full flow works before payments are enabled.
  signup: { bonusCredits: 20, bonusExpiresDays: null, bonusPerIpDaily: 1, bonusSiteDaily: 20 },
  guest: { dailyPerDevice: 0, dailyPerIp: 0, dailySiteBudget: 0, minRecaptchaScore: 0.5 },
  billing: { provider: 'stripe', automaticTax: false },
  analytics: {},
});
