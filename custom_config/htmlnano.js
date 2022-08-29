/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');
const htmlnano = require('../node_modules/htmlnano');

const distFolderPath = path.normalize(`${__dirname}/../dist`);
// console.log(distFolderPath);
const html = distFolderPath + '/index.html';

const options = {
  // Disable the module "removeEmptyAttributes"
  removeEmptyAttributes: false,
  // Pass options to the module "collapseWhitespace"
  collapseWhitespace: 'aggressive',
  // Remove duplicate values from list-like attributes
  // class="sidebar left sidebar" class="sidebar left"
  deduplicateAttributeValues: true,
  // removes conditional comments  and <!--noindex--><!--/noindex--> too (IE)
  removeComments: 'all',
  // Removes empty safe-to-remove attributes.
  // This module could break your styles or JS if you use selectors with attributes:
  // img[style=""] {    margin: 10px;}
  removeEmptyAttributes: true,
  // Remove quotes around attributes when possible
  removeAttributeQuotes: true,
  // Merges multiple <style> with the same media and type into one tag.
  //  <style scoped>...</style> are skipped.
  mergeStyles: true,
  // The module won't impact the plain-text size of the output.
  // However it will improve the compression ratio of gzip/brotli used in HTTP compression.
  normalizeAttributeValues: true,
};

// posthtml, posthtml-render, and posthtml-parse options
const postHtmlOptions = {
  sync: true, // https://github.com/posthtml/posthtml#usage
  lowerCaseTags: true, // https://github.com/posthtml/posthtml-parser#options
  quoteAllAttributes: false, // https://github.com/posthtml/posthtml-render#options
};

fs.readFile(html, 'utf8', function(err, data) {
  if (err) {
    return console.error(err);
  }
  console.log(html);
  htmlnano
  // "preset" arg might be skipped (see "Presets" section below for more info)
  // "postHtmlOptions" arg might be skipped
      .process(data, options)
      .then(function(result) {
        fs.writeFile(html, result.html, (err) => {
          if (err) {
            console.error(err);
            return;
          }
        // file written successfully
        });
      // result.html is minified
      })
      .catch(function(err) {
        console.error(err);
      });
});
