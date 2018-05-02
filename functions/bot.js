const http = require('http');
const axios = require('axios');

module.exports = (functions, admin) => {
  let module = {};

  module.index = (req, res) => {
    processMessage = (message) => {
      const messageRegex = /(?:\/(\w+)\s?)?([\s\w]*)/;

      let [fullText, command, text] = messageRegex.exec(message.text);

      if (command) { return executeCommand(command, message); }

      return sendMessage({
        chatId: message.chat.id,
        text: "Hey there! d:^)"
      })
    }

    executeCommand = (command, message) => {
      if (command === "start") {
        return start(message);
      } else {
        return sendMessage({
          chatId:  message.chat.id,
          text: 'Unknown command ;~;'
        });
      }
    }

    sendMessage = (options) => {
      const token = functions.config().telegram.bot_key;
      const url = `https://api.telegram.org/bot${token}/sendMessage`;

      axios.post(url, {
        chat_id: options.chatId,
        text: options.text
      })
      .then((response) => {
        console.log(response);
        return res.send({ status: 'OK'});
      })
      .catch((error) => {
        console.log(error);
        return res.sendStatus(500);
      });
    }

    start = (message) => {
      return admin.database().ref(`/users/${message.from.id}`).set(message.from).then(
        () => sendMessage({
          chatId:  message.chat.id,
          text: 'Your data\'s saved correctly d:^)'
        })
      ).catch(
        () => sendMessage({
          chatId:  message.chat.id,
          text: 'There\'s an error saving your data ;~;'
        })
      );
    }

    const callToken = req.path;

    if ( callToken !== functions.config().telegram.bot_key ) {
      processMessage(req.body.message);
    } else {
      res.sendStatus(403);
    }
  };

  return module;
}
