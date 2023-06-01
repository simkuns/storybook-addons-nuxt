import { resolve } from "path";
import { type StorybookConfig } from "@storybook/vue3-vite";

const config: StorybookConfig = {
  stories: [],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    resolve(__dirname, "./storybook-addon-nuxt/preset"),
  ],
  framework: {
    name: "@storybook/vue3-vite",
    options: {},
  },
  // docs: {
  //   autodocs: "tag",
  // },
  // logLevel: 'verbose'
};

export default config;
