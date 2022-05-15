/**
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
  ignoredRouteFiles: ['.*'],
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // serverBuildPath: "build/index.js",
  // publicPath: "/build/",
  // devServerPort: 8002,
  serverDependenciesToBundle: [
    /^refractor.*/,
    /^is-.*/,
    'hastscript',
    'property-information',
    'hast-util-parse-selector',
    'space-separated-tokens',
    'comma-separated-tokens',
    'parse-entities',
    'character-entities-legacy',
    'character-reference-invalid',
    'decode-named-character-reference',
    'character-entities',
  ],
};
