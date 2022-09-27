// Requiring .env file which contains configuration variables or sensitive information.  Please see https://www.npmjs.com/package/dotenv for documentation.
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
// require('dotenv').config()
// console.log(process.env)
// console.log(require('dotenv').config())

module.exports = process.env