/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const critical = require('../node_modules/critical');

const distFolderPath = path.normalize(`${__dirname}/../dist`);
// console.log(distFolderPath);
const html = distFolderPath + '/index.html';
const css = distFolderPath + '/main-6b642123f6189b2b3982.css';

critical.generate({
  // Inline the generated critical-path CSS
  // - true generates HTML
  // - false generates CSS
  inline: true,

  // Your base directory
  base: distFolderPath,


  // HTML source file
  src: html,

  // Your CSS Files (optional)
  css: [css],

  // Viewport width
  width: 1300,

  // Viewport height
  height: 900,

  // Output results to file
  target: {
    css: 'critical.css',
    html: 'index-critical.html',
    uncritical: 'uncritical.css',
  },

  // Extract inlined styles from referenced stylesheets
  extract: true,

  // ignore CSS rules
  ignore: {
    atrule: ['@font-face'],
    decl: (node, value) => /big-image\.png/.test(value),
  },
});
