// Retrieving current datetime (format: 'YYYY-MM-DD hh:mm:ss').
var dateObj = new Date();
var timestamp = `${dateObj.getFullYear()}-${dateObj.getMonth() + 1}-${dateObj.getDate()} ${dateObj.getHours()}:${dateObj.getMinutes()}:${dateObj.getSeconds()}`;

module.exports = {
    getCurrentTimeStamp : timestamp
};