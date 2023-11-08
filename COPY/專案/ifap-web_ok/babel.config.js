module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset',
  ],
  plugins: [
    [
      'import', // 載入套件ant-design-vue
      { libraryName: 'ant-design-vue', libraryDirectory: 'es', style: true },
    ],
  ],
};
