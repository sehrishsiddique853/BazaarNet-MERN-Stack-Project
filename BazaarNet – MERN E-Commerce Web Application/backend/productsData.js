const fs = require('fs');
const path = require('path');

/*
 * Load the product list from the plain‑text file and convert it into a
 * JavaScript array. Each product in `new_products_list.txt` is written
 * as a JavaScript object literal separated by commas and newlines. We
 * wrap the entire file contents in square brackets and use `eval` to
 * interpret it as an array of objects. Because this file is internal
 * to the project and not user controlled, using `eval` here is safe.
 */
const dataString = fs.readFileSync(path.join(__dirname, 'new_products_list.txt'), 'utf8');

// Convert the string into an array of objects. The file does not contain
// surrounding brackets, so we add them here before evaluating.
const products = eval('[' + dataString + ']');

module.exports = products;