import { definePublicModels } from '@shipwords/jobs/models';

// Public model list shown on the page. Upstream models and cost caps live in src/models.server.ts.
export default definePublicModels([
  {
    id: 'nano-banana-pro',
    name: 'Studio portrait',
    kind: 'image',
    credits: 10,
    guest: false,
    allowedParameters: ['aspect_ratio'],
    defaults: { aspect_ratio: '1:1' },
    maxReferences: 4,
  },
  {
    id: 'gpt-image-2',
    name: 'Gallery portrait',
    kind: 'image',
    credits: 15,
    guest: false,
    allowedParameters: ['aspect_ratio'],
    defaults: { aspect_ratio: '1:1' },
    maxReferences: 4,
  },
]);
