module.exports = {
  presets: [
    // JSX 需要的時候在引入
    // '@vue/cli-plugin-babel/preset', '@vue/babel-preset-jsx'
  ],
  plugins: [
    [
      "import",
      { libraryName: "ant-design-vue", libraryDirectory: "es", style: true }
    ]
  ]
}
