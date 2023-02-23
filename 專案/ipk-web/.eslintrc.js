module.exports = {
		root: true,
		env: {
			node: true,
		},
		extends: [
			'plugin:vue/recommended',
			'@vue/eslint-config-airbnb',
			'@vue/typescript/recommended',
		],
		parserOptions: {
			ecmaVersion: 2020,
			parser: '@typescript-eslint/parser',
		},
		plugins: [
			'vue',
		],
		rules: {
			'prefer-const': 'off',
			'class-methods-use-this': 0,
			'max-len': [
				'warn',
				{
					code: 200,
					tabWidth: 2,
					ignoreComments: false,
					ignoreUrls: true,
					ignoreTemplateLiterals: true,
				},
			],
			'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
			'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
			'@typescript-eslint/ban-ts-ignore': 0,
			'@typescript-eslint/no-explicit-any': 0,
			'@typescript-eslint/no-unused-vars': 0,
			'@typescript-eslint/no-this-alias': 0,
			'@typescript-eslint/class-name-casing': 0,
			'@typescript-eslint/no-non-null-assertion': 0,
			indent: ['off', 'tab'],
			'no-tabs': ['off', {
				allowIndentationTabs: 1,
				VariableDeclarator: 1,
				SwitchCase: 1,
				ignoredNodes: 1,
			}],
			'no-mixed-spaces-and-tabs': 0, // 無法format成eslint要的格式

			'no-plusplus': 'off',
			eqeqeq: "off",
			'func-names': 0,
			'default-case': 'off',
			'no-unused-vars': 'off',
			'no-case-declarations': 'off',
			'consistent-return': 'off',
			'no-unused-expressions': 'off',
			radix: 'off',
			'import/extensions': 'off',
			'import/no-unresolved': 'off',
			'no-shadow': 'off',
			'@typescript-eslint/no-empty-interface': 'off',
			'no-param-reassign': 'off',
			'no-nested-ternary': 'off',
			'no-empty': 'off',
			'prefer-destructuring': 'off',
			'no-underscore-dangle': 'off',
			'no-restricted-globals': 'off',
			'implicit-arrow-linebreak': 'off',
			'vue/require-default-prop': 'off',
			'vue/require-prop-types': 'off',
			'import/no-extraneous-dependencies': 'off',
			'global-require': 'off',
			camelcase: 'off',
			'@typescript-eslint/no-use-before-define': 'off',
			'@typescript-eslint/no-var-requires': 0,
			'@typescript-eslint/camelcase': 'off',
			'no-return-assign': 'off',
			'array-callback-return': 0,

			'linebreak-style': ['off', 'windows'],
			'vue/attribute-hyphenation': ['off'],
			'vue/max-attributes-per-line': 'off', // 格式化属性换行 vue/max-attributes-per-line
			// 'vue/max-attributes-per-line': ['error', {
			//   "singleline": 3,
			//   "multiline": {
			//     "max": 3,
			//     "allowFirstLine": false
			//   }
		  // }], // 格式化属性换行 vue/max-attributes-per-line
			'vue/no-v-html': 'off',				// 關閉 v-html 危險檢核
			"vue/order-in-components": ["error", { // 排序規則
				"order": [
					"el",
					"name",
					"key",
					"parent",
					"functional",
					["delimiters", "comments"],
					["components", "directives", "filters"],
					"extends",
					"mixins",
					["provide", "inject"],
					"ROUTER_GUARDS",
					"layout",
					"middleware",
					"validate",
					"scrollToTop",
					"transition",
					"loading",
					"inheritAttrs",
					"model",
					["props", "propsData"],
					"emits",
					"setup",
					"asyncData",
					"data",
					"fetch",
					"head",
					"computed",
					"watch",
					"watchQuery",
					"LIFECYCLE_HOOKS",
					"methods",
					["template", "render"],
					"renderError"
				]
			}]
		},
	settings: {
		// 解決 Missing file extension "ts" for ... (STEP 2)
		'import/extensions': 'allExtensions',
	},
	// overrides: [
	//   {
	//     files: [
	//       './src/**/__tests__/*.spec.{j,t}s',
	//       './src/**/__mock__/*.{j,t}s',
	//     ],
	//     env: {
	//       jest: true,
	//     },
	//     rules: {
	//       'no-unused-expressions': 0,
	//     },
	//   },
	// ],
};
