import { proxyRybbit } from '@shipwords/core/analytics';
import { defineGenerationWorkflow } from '@shipwords/jobs/workflow';
import handler from '@tanstack/react-start/server-entry';
import { paraglideMiddleware } from '~/paraglide/server.js';
import site from '../site.config';
import models from './models.server';

// Worker entry: pages and API go to TanStack Start, plus the Workflow class for mock generation jobs. No compose container in the demo build.
export const GenerationWorkflow = defineGenerationWorkflow(models, site);

export default {
  async fetch(request, env) {
    // Rybbit stats go through /stats/ on this site and are forwarded to the collector here.
    const stats = await proxyRybbit(request, env.RYBBIT_UPSTREAM);
    if (stats) return stats;
    // Only local dev picks the locale from a cookie (Chinese review); production is English only and passes requests straight to TanStack Start.
    return import.meta.env.DEV
      ? paraglideMiddleware(request, () => handler.fetch(request))
      : handler.fetch(request);
  },
} satisfies ExportedHandler<Env>;
