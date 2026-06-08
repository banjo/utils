import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        deps: {
            inline: ["vitest-localstorage-mock"],
        },
        environment: "happy-dom",
        setupFiles: ["./test/setup.ts"],
    },
});
