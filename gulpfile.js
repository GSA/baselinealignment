/* gulpfile.js */

const uswds = require("@uswds/compile");

/**
 * USWDS version
 * Set the version of USWDS you're using (2 or 3)
 */

uswds.settings.version = 3;

/**
 * Path settings
 * Set as many as you need
 */

 uswds.paths.src.uswds = './node_modules/@uswds';
 uswds.paths.src.sass = './node_modules/@uswds/uswds/packages';
 uswds.paths.src.theme = './node_modules/@uswds/uswds/dist/theme';
 uswds.paths.src.fonts = './node_modules/@uswds/uswds/dist/fonts';
 uswds.paths.src.img = './node_modules/@uswds/uswds/dist/img';
 uswds.paths.src.js = './node_modules/@uswds/uswds/dist/js';
 uswds.paths.src.projectSass = './_site/sass';
 uswds.paths.dist.theme = './_site/sass';
 uswds.paths.dist.img = './_site/assets/images';
 uswds.paths.dist.fonts = './_site/assets/fonts';
 uswds.paths.dist.js = './_site/assets/js';
 uswds.paths.dist.css = './_site/assets/css';

/**
 * Exports
 * Add as many as you need
 */

exports.init = uswds.init;
exports.compile = uswds.compile;
exports.compileIcons = uswds.compileIcons;
exports.compileSass = uswds.compileSass;
exports.default = uswds.default;
exports.copyAll = uswds.copyAll;
exports.copyAssets = uswds.copyAssets;
exports.copyFonts = uswds.copyFonts;
exports.copyImages = uswds.copyImages;
exports.copyJS = uswds.copyJS;
exports.copySetup = uswds.copySetup;
exports.updateUswds = uswds.updateUswds;
exports.watch = uswds.watch;