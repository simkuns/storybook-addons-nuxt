import { resolve } from "path";
import { defineNuxtModule } from "@nuxt/kit";
import { type StorybookConfig } from "@storybook/vue3-vite";

export default defineNuxtModule({
  meta: { name: "nuxt-storybook" },
  setup(_, nuxt) {
    function rootResolver(...paths: string[]) {
      return resolve(nuxt.options.rootDir, ...paths);
    }

    nuxt.hook("storybook:config", ({ stories }) => {
      stories ||= [];
      stories.push(
        rootResolver("./components/**/*.mdx"),
        rootResolver("./components/**/*.stories.@(js|jsx|ts|tsx)"),
      )
    });
  },
});

declare module "@nuxt/schema" {
  interface NuxtHooks {
    'storybook:config': (storybookConfig: Partial<StorybookConfig>) => void;
  }
}
