const { createWriteStream } = require('fs');
const { getAudioUrl } = require('google-tts-api');
const axios = require('axios');

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
    const urlMessage = getAudioUrl(message, {
      lang: 'pt-br',
      slow: false,
      host: 'http://translate.google.com',
    });
    const writer = createWriteStream(fileName);
    return axios.get(urlMessage, (response) => {
      response.pipe(writer);
    });
  },
  getTtsmp3VoiceMessage: async (msg, fileName, lang = 'Ricardo') => {
    const data = `msg=${msg}&lang=${lang}&source=ttsmp3`;
  
    const config = {
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
      }
    };

    const writer = createWriteStream(fileName);
    return axios.post('https://ttsmp3.com/makemp3_new.php', data, config)
      .then((res) => {
        return axios.get(res.data.URL, {
          responseType: 'stream'
        })
          .then((response) => {
            response.data.pipe(writer);
          });
      }).catch((err) => {
          console.error(err);
      });
  }
}