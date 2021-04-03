const { PREFIX } = process.env;
const { checkPermissionForSpeak, getTtsmp3VoiceMessage } = require('../utils');

const SAY_MESSAGE_FILE_NAME = 'say-message.mp3'

module.exports = {
	name: 'say',
	description: 'Comando para fazer o bot falar uma frase no canal de voz atual',
	async execute(message, args) {
    const voiceChannel = message.member.voice.channel;

    if (!voiceChannel) {
      return message.reply(
        "Você precisa estar em um canal de voz!"
      );
    }

    checkPermissionForSpeak(message, voiceChannel);
    const audioMessage = args.join(' ').replace(`${PREFIX}say`, '');
    await getTtsmp3VoiceMessage(audioMessage, 
      SAY_MESSAGE_FILE_NAME);

    const connection = await voiceChannel.join();
    try {
      connection.voice.setSelfDeaf(true);
      const dispatcher = connection.play(SAY_MESSAGE_FILE_NAME);
      dispatcher.on('finish', () => {
        voiceChannel.leave();
      });
    } catch (err) {
      console.log(err);
      voiceChannel.leave();
    }
	},
};