const UglifyJsPlugin = require('terser-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const IS_PROD = process.env.NODE_ENV === 'production';
const IS_UAT = process.env.NODE_ENV === 'uat';

module.exports = {
	runtimeCompiler: true,
	publicPath: process.env.PUBLIC_PATH !== undefined ? process.env.PUBLIC_PATH : '/',
	filenameHashing: true,
	configureWebpack: (config) => {
		// enable source-map
		config.devtool = 'source-map';

		config.output.chunkFilename = '[name].[hash].js';

		config.output.filename = '[name].[hash].js';

		// enable uglify
		if (IS_PROD || IS_UAT) {
			const plugins = [];
			// get a reference to the existing ForkTsCheckerWebpackPlugin
			const existingForkTsChecker = config.plugins.filter(
				(p) => p instanceof ForkTsCheckerWebpackPlugin,
			)[0];

			// remove the existing ForkTsCheckerWebpackPlugin
			// so that we can replace it with our modified version
			config.plugins = config.plugins.filter(
				(p) => !(p instanceof ForkTsCheckerWebpackPlugin),
			);

			// copy the options from the original ForkTsCheckerWebpackPlugin
			// instance and add the memoryLimit property
			const forkTsCheckerOptions = existingForkTsChecker.options;
			forkTsCheckerOptions.workers = 4;
			forkTsCheckerOptions.memoryLimit = 8192;

			plugins.push(
				new UglifyJsPlugin({
					terserOptions: {
						warnings: true,
						output: {
							comments: false,
							beautify: false,
						},
						compress: {
							drop_console: true,
							drop_debugger: true,
						},
					},
					parallel: true,
				}),
			);
			config.plugins.push(new ForkTsCheckerWebpackPlugin(forkTsCheckerOptions));
			config.plugins = [...config.plugins, ...plugins];
		}
	},
	css: {
		extract: true,
		loaderOptions: {
			scss: {
				additionalData: `
                  @import "@/style/varibles.scss";
									@import "@/style/mixin.scss";
                `,
			},
			less: {
				lessOptions: {
					modifyVars: {
						// https://github.com/vueComponent/ant-design-vue/blob/master/components/style/themes/default.less
						'border-radius-base': '4px',
						'primary-color': '#4CAAF5',
						'font-size-base': '16px',
						// 'btn-border-radius-base': '50vh',
						'btn-font-size': '16px',
						'btn-height-base': '36px',
						'table-header-bg': '#7CACD3',
						'table-header-color': '#FFFFFF',
						'table-row-hover-bg': '#F2F8FF',
						'table-border-radius-base': '0px',
						'pagination-item-bg-active': '#4CAAF5',
						'form-item-margin-bottom': '15px',
						// For compacted styling:
						// 'padding-lg': '24px',
						// 'padding-md': '16px',
						// 'padding-sm': '12px',
						// 'padding-xs': '8px',
						// 'table-padding-vertical': '4px',
						// 'border-color-base': '#d9d9d9',
						// 'border-width-base': '1px',
					},
					javascriptEnabled: true,
				},
			},
		},
	},
	devServer: {
		proxy: {
			'^/api': {
				port: 8080,
				target: 'http://SDTWLVX00391:8083/giiss-api',
				ws: true,
				changOrigin: true,
			},
		},
	},
};
