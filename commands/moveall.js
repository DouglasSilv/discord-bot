const { compareTwoStrings } = require('string-similarity');
const { checkPermissionForSpeak, getTtsmp3VoiceMessage } = require('../utils');

const WELCOME_MESSAGE_FILE_NAME = 'welcome-message.mp3';

module.exports = {
	name: 'moveall',
	description: 'Move todos os membros do canal atual para outro canal de voz.',
	async execute(message) {
    if (!message.member.voice.channel) return message.reply('você precisa estar em um canal de voz para mover os membros!');

    const { voiceChannel, bestMatch } = getBestMatchAndVoiceChannel(message);

    if (voiceChannel) {
      message.member.voice.channel.members.forEach(member => {
        member.voice.setChannel(voiceChannel);
      });
      message.channel.send(`Apertem os cintos! Rumo ao canal **${bestMatch.name}** - **${voiceChannel.name}**`);
      message.react('🚀');

      await playWelcomeVoiceMessage(bestMatch, message, voiceChannel);
    } else {
      message.reply(`a categoria **${bestMatch.name}** não possui nenhum canal de voz`);
    }
    
	},
};

const getDayOfTheWeek = () => {
  const numberOfTheDay = new Date(new Date().toLocaleString("en-US", {timeZone: "America/Sao_Paulo"})).getDay();

  switch (numberOfTheDay) {
    case 1:
      return 'Segundouuuu';
    case 2:
      return 'Terçouuuu';
    case 3:
      return 'Quartouuuu';
    case 4:
      return 'Quintouuuu';
    case 5:
      return 'Sextouuuu';
    case 6:
      return 'Sabadouuuu';
    case 0:
      return 'Domingouuu';
  }
}  

const playWelcomeVoiceMessage = async (bestMatch, message, voiceChannel) => {
  checkPermissionForSpeak(message, voiceChannel);
  await getTtsmp3VoiceMessage(`Boa jogatina de ${bestMatch.name} gurizada! ${getDayOfTheWeek()}!`, 
                                  WELCOME_MESSAGE_FILE_NAME);

  const connection = await voiceChannel.join();
  try {
    connection.voice.setSelfDeaf(true);
    const dispatcher = connection.play(WELCOME_MESSAGE_FILE_NAME);
    dispatcher.on('finish', () => {
      voiceChannel.leave();
    });
  } catch (err) {
    console.log(err);
    voiceChannel.leave();
  }
}

const getBestMatchAndVoiceChannel = (message) => {
  const criteria = message.content.substring(message.content.indexOf('move') + 5, message.content.length).toUpperCase();

  const categories = message.guild.channels.cache
    .filter(c => c.type == 'category')
    .map(c => { return { ...c, name: c.name.toUpperCase() }; });

  const bestMatch = categories.reduce((prev, current) => {
    return (compareTwoStrings(prev.name, criteria) >
      compareTwoStrings(current.name, criteria)) ?
      prev : current;
  });

  const voiceChannels = message.guild.channels.cache.filter(c => c.type == 'voice');

  const voiceChannel = voiceChannels.find(c => c.parentID === bestMatch.id);
  return { voiceChannel, bestMatch };
}
