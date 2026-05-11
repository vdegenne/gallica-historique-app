import {config, nodeResolve, terser, typescript} from '@vdegenne/rollup'

export default config({
	input: './src/chrome-extension/content.ts',
	output: {dir: './chrome-extension/'},
	plugins: [
		typescript({
			include: [
				'./src/chrome-extension/**/*.ts',
				'./src/api.ts',
				'./src/server/api.ts',
				'./types.d.ts',
			],
		}),
		nodeResolve(),
		terser(),
	],
})
