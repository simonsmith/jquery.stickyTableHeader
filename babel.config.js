module.exports = api => {
  const isTest = api.env('test');
  const plugins = ['transform-class-properties'];
  const presets = [
    [
      '@babel/preset-env',
      {
        targets: 'last 2 versions, ie > 9',
      },
    ],
  ];
  if (isTest) {
    plugins.push('@babel/plugin-transform-runtime');
  }
  return {
    presets,
    plugins,
  };
};
