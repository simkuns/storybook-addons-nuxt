import { loadNuxt, buildNuxt } from "@nuxt/kit";
import { InlineConfig } from "vite";
import { type StorybookConfig } from "@storybook/vue3-vite";

type NuxtStorybookConfig = Partial<StorybookConfig & {
  viteConfig?: InlineConfig
}>;

export function deferNuxtStorybookConfig() {
  let resolve: (value: NuxtStorybookConfig) => void, reject: (err: any) => void;

  type DeferredNuxtStorybookConfig = Promise<NuxtStorybookConfig> & {
    resolve: typeof resolve,
    reject: typeof reject,
  };

  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  }) as DeferredNuxtStorybookConfig;

  promise.resolve = resolve!;
  promise.reject = reject!;

  return promise;
}

export async function resolveNuxtStorybookConfig(deferredNuxtStorybookConfig) {
  const storybookConfig: NuxtStorybookConfig = {
    stories: [],
    viteConfig: {},
  };

  const nuxt = await loadNuxt({
    cwd: process.cwd(),
    dev: false,
    overrides: {
      debug: true,
      ssr: false,
      app: {
        rootId: "nuxt-storybook",
      },
      pages: false,
    },
  });

  nuxt.hook("modules:done", () => {
    nuxt.callHook("storybook:config", storybookConfig);
  });

  nuxt.hook("vite:extendConfig", (config, { isClient }) => {
    if (isClient) {
      storybookConfig.viteConfig = config;
    }
  });

  try {
    await nuxt.ready();
    await buildNuxt(nuxt);
    deferredNuxtStorybookConfig.resolve(storybookConfig);
  } catch (err) {
    deferredNuxtStorybookConfig.reject(err);
  } finally {
    nuxt.close();
  }
}

declare module "@nuxt/schema" {
  interface NuxtHooks {
    'storybook:config': (storybookConfig: NuxtStorybookConfig) => void;
  }
}

