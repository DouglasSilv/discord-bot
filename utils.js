const { get } = require('http');
const { createWriteStream } = require('fs');
const { getAudioUrl } = require('google-tts-api');

module.exports = {
  checkPermissionForSpeak: (message, voiceChannel) => {
    const permissions = voiceChannel.permissionsFor(message.client.user);

    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
      return message.channel.send(
        `Eu preciso de permissão para me conectar no canal ${voiceChannel.name}!`
      );
    }
  },
  getGoogleTranslateVoiceMessage: (message, fileName) => {
    const urlWelcomeMessage = getAudioUrl(message, {
      lang: 'pt-br',
      slow: false,
      host: 'http://translate.google.com',
    });
    const file = createWriteStream(fileName);
    get(urlWelcomeMessage, (response) => {
      response.pipe(file);
    });
  }
}