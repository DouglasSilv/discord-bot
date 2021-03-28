const ytdl = require('ytdl-core');
const YouTube = require("discord-youtube-api");
const { MessageEmbed } = require('discord.js');
const { checkPermissionForSpeak } = require('../utils');

const youTube = new YouTube(process.env.YOUTUBE_KEY);

module.exports = {
  name: 'play',
  description: 'Toca uma música no seu canal de voz atual',
  execute(msg) {
    execute(msg);
  },
};

const execute = async (message) => {
  try {
    const args = message.content.split(" ");
    const queue = message.client.queue;
    const serverQueue = message.client.queue.get(message.guild.id);

    const voiceChannel = message.member.voice.channel;

    if (!voiceChannel)
      return message.reply(
        "Você precisa estar em um canal de voz!"
      );

    checkPermissionForSpeak(message, voiceChannel);

    if (serverQueue && serverQueue.connection.dispatcher.paused) {
      serverQueue.connection.dispatcher.resume();
      message.react('▶');
      return;
    }

    let songInfo;
    
    if (isURL(args[1])) {
      songInfo = await ytdl.getInfo(args[1]);
    } else {
      const video = await youTube.searchVideos(args.toString().replace(/,/g,' '));
      songInfo = await ytdl.getInfo(video.id);
    }
    
    const song = {
      title: songInfo.videoDetails.title,
      url: songInfo.videoDetails.video_url
    };

    if (!serverQueue) {
      const queueContruct = {
        textChannel: message.channel,
        voiceChannel: voiceChannel,
        connection: null,
        songs: [],
        volume: 5,
        playing: true
      };

      queue.set(message.guild.id, queueContruct);

      queueContruct.songs.push(song);

      try {
        const connection = await voiceChannel.join();
        connection.voice.setSelfDeaf(true);
        queueContruct.connection = connection;
        play(message, queueContruct.songs[0]);
      } catch (err) {
        console.log(err);
        queue.delete(message.guild.id);
        return message.channel.send(err);
      }
    } else {
      serverQueue.songs.push(song);

      return message.channel.send(buildMessage(message, song))
        .then((message) => {
          message.react('🎵');
      });
    }
  } catch (error) {
    console.log(error);
    message.channel.send(error.message);
  }
}

const play = (message, song) => {
  const queue = message.client.queue;
  const guild = message.guild;
  const serverQueue = queue.get(message.guild.id);

  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }

  const dispatcher = serverQueue.connection
    .play(ytdl(song.url))
    .on('finish', () => {
      serverQueue.songs.shift();
      play(message, serverQueue.songs[0]);
    })
    .on('error', error => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    serverQueue.textChannel
    .send(buildMessage(message, song))
    .then((message) => {
      message.react("🎵");
    });
}

const isURL = (url = '') => {
  return url.includes('https://www.youtube.com/watch?v');
}

const buildMessage = (message, song) => {
  const user = message.mentions.users.first() || message.author;

  return new MessageEmbed()
        .setTitle(song.title)
        .setURL(song.url)
        .setColor('#0099ff')
        .setDescription(`Música adicionada por ${user}!`)
}