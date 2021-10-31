const moment = require('moment');
//moment class for getting exact time

function formatMessage(username, text) {
  /**
   * this method getting a message with exact form
   */
  return {
    username,//sender username
    text,//message text
    time: moment().format('h:mm a')//time format
  };
}

module.exports = formatMessage;//exporting format message