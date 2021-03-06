module.exports = {
  sourceDir: 'extension',
  artifactsDir: 'build',
  verbose: true,
  run: {
    firefox: 'nightly',
    startUrl: ['about:debugging', 'https://gem-examples.netlify.app/'],
  },
  build: {
    overwriteDest: true,
  },
};
