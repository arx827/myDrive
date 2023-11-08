const UglifyJsPlugin = require('terser-webpack-plugin');

const path = require('path');

const resolve = (dir) => path.join(__dirname, dir);

const IS_PROD = ['production', 'prod', 'production2'].includes(process.env.NODE_ENV);
const IS_UAT = ['uat', 'ut'].includes(process.env.NODE_ENV);
const IS_DEV = ['dev', 'develop'].includes(process.env.NODE_ENV);

module.exports = {
	runtimeCompiler: true,
	publicPath: process.env.PUBLIC_PATH !== undefined ? process.env.PUBLIC_PATH : '/',
	chainWebpack: (config) => {
		config.resolve.alias
			.set('@', resolve('src'))
			.set('@assets', resolve('src/assets'))
			.set('@images', resolve('src/assets/images'))
			.set('@compononts', resolve('src/components/shared'))
			.set('@scss', resolve('src/style'));
	},
	configureWebpack: (config) => {
		// enable source-map
		config.devtool = 'source-map';

		config.output.chunkFilename = 'js/[name].[hash:8].js';

		config.output.filename = 'js/[name].[hash:8].js';

		// enable uglify
		if (IS_PROD || IS_UAT || IS_DEV) {
			const plugins = [];
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
			config.plugins = [...config.plugins, ...plugins];
		}
		config.optimization = {
			splitChunks: {
				chunks: 'all',
				cacheGroups: {
					bootstrap: {
						name: 'bootstrap',
						test: /[\\/]node_modules[\\/]bootstrap[\\/]/,
						priority: 10,
					},
					antDesignVue: {
						name: 'chunk-ant-design-vue',
						test: /[\\/]node_modules[\\/]ant-design-vue[\\/]/,
						chunks: 'initial',
						priority: 3,
						reuseExistingChunk: true,
						enforce: true,
					},
				},
			},
		};
	},
	css: {
		extract: {
			ignoreOrder: IS_PROD,
			chunkFilename: 'css/[name].[hash:8].css',
		},
		sourceMap: IS_PROD,
		loaderOptions: {
			scss: {
				additionalData: `
          @import "@/style/_varibles.scss";
					@import "@/style/_mixin.scss";
					@import "@/style/_bsDefault.scss";
        `,
			},
			less: {
				lessOptions: {
					modifyVars: {
						// https://github.com/vueComponent/ant-design-vue/blob/master/components/style/themes/default.less
						'border-radius-base': '4px',
						'primary-color': '#23C4A8',
						'font-size-base': '16px',
						'text-color': '#000000',
						// 'btn-border-radius-base': '50vh',
						'btn-font-size': '16px',
						'btn-height-base': '40px',
						'table-header-bg': '#F5F8FC',
						'table-header-color': '#000000D9',
						'table-row-hover-bg': '#E6F7FF',
						'table-border-radius-base': '0px',
						'pagination-item-bg-active': '#999999',
						'form-item-margin-bottom': '15px',
						'input-border-color': '#EBEBEB',
					},
					javascriptEnabled: true,
				},
			},
		},
	},
	productionSourceMap: false,
	devServer: {
		proxy: {
			'^/api': {
				port: process.env.VUE_APP_API_BASE_URL_PORT,
				target: process.env.VUE_APP_AXIOS_API_BASE_URL,
				ws: true,
				changOrigin: true,
			},
		},
	},
};
