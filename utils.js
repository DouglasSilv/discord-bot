module.exports = {
  checkPermissionForSpeak: (message, voiceChannel) => {
    const permissions = voiceChannel.permissionsFor(message.client.user);

    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
      return message.channel.send(
        `Eu preciso de permissão para me conectar no canal ${voiceChannel.name}!`
      );
    }
  }
}