import { defineConfig, loadEnv } from "vite";
import {
	createViteProxy,
	getRootPath,
	getSrcPath,
	setupVitePlugins,
} from "./build";
import { getServiceEnvConfig } from "./.env-config";

export default defineConfig((configEnv) => {
	const viteEnv = loadEnv(
		configEnv.mode,
		process.cwd()
	) as unknown as ImportMetaEnv;

	const rootPath = getRootPath();
	const srcPath = getSrcPath();

	const isOpenProxy = viteEnv.VITE_HTTP_PROXY === "Y";
	const envConfig = getServiceEnvConfig(viteEnv);

	return {
		base: viteEnv.VITE_BASE_URL,
		resolve: {
			alias: {
				"~": rootPath,
				"@": srcPath,
			},
		},
		plugins: setupVitePlugins(viteEnv),
		css: {
			preprocessorOptions: {
				scss: {
					additionalData: `@use "./src/styles/scss/global.scss" as *;`,
				},
			},
		},
		server: {
			host: "0.0.0.0",
			open: true,
			port: 8080,
			proxy: createViteProxy(isOpenProxy, envConfig),
		},
		build: {
			reportCompressedSize: false,
			sourcemap: false,
			commonjsOptions: {
				ignoreTryCatch: false,
			},
		},
	};
});
