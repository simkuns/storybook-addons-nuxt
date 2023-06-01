import { mergeConfig } from "vite";
import { deferNuxtStorybookConfig, resolveNuxtStorybookConfig } from "./utils";

const deferredNuxtStorybookConfig = deferNuxtStorybookConfig();

/** @type { import('@storybook/vue3-vite').StorybookConfig } */
const config = {
  stories: async (stories: string[] = []) => {
    return [
      ...stories,
      ...((await deferredNuxtStorybookConfig).stories || []),
    ];
  },
  viteFinal: async (config) => {
    const { viteConfig } = await deferredNuxtStorybookConfig;

    const mergedConfig = mergeConfig(
      {
        resolve: viteConfig?.resolve,
        optimizeDeps: viteConfig?.optimizeDeps,
        plugins: viteConfig?.plugins?.filter(p => !(p && typeof p === "object" && "name" in p && p.name.includes("vite:vue"))),
        define: viteConfig?.define,
      },
      config,
    )

    return mergedConfig;
  },
};

resolveNuxtStorybookConfig(deferredNuxtStorybookConfig);

export default config;
