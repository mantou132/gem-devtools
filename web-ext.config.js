module.exports = {
  sourceDir: 'extension',
  artifactsDir: 'build',
  verbose: true,
  run: {
    firefox: 'nightly',
    startUrl: ['about:debugging', 'https://gem-docs.netlify.com/'],
  },
  build: {
    overwriteDest: true,
  },
};
