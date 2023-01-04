/** @type {import('vite').UserConfig} */
module.exports = {
  build: {
    minify: true,
    rollupOptions: {
      plugins: [inlineInitialCss()],
      output: {
        entryFileNames: 'assets/[name].js',
      },
    },
  },
};
function inlineInitialCss() {
  return {
    name: 'inline-initial-css', // this name will show up in warnings and errors
    generateBundle(options, bundle, isWrite) {
      const fileNames = Object.keys(bundle);
      const initialCssFile = fileNames.find((fileName) =>
        /^assets\/index\.[a-z0-9]+\.css$/.test(fileName)
      );
      const htmlFile = fileNames.find((fileName) =>
        /index\.html/.test(fileName)
      );
      const htmlFileChunk = bundle[htmlFile];
      const initialCssFileChunk = bundle[initialCssFile];
      const matcher = `<link rel="stylesheet" href="/${initialCssFile}">`;
      htmlFileChunk.source = htmlFileChunk.source.replace(
        new RegExp(matcher),
        `<style>${initialCssFileChunk.source}</style>`
      );
    },
  };
}
