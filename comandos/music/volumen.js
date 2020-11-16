import Command from '../../utils/comando.js';
import Discord from 'discord.js';
import config from '../../config/bot.json';
import util from 'util';
import ytdl from 'ytdl-core';
import search from 'youtube-search';
import quick from "quick.db";
const db = new quick.table("dj_role");
export default class extends Command {
  constructor(options){
    super(options)
    this.usage = "volumen <1 al 200>";
  }
  async run(message, args){
    const queue = this.client.queue
  const serverQueue = this.client.queue.get(message.guild.id);
  const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.channel.send('¡Necesitas unirte a un canal de voz para reproducir música!');
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
      return message.channel.send('¡Necesito permisos para unirme y/o hablar en el canal de Voz!');
    };
    const embed = new Discord.MessageEmbed();
     if (!serverQueue) {
      embed.setAuthor("No hay nada en la queue")
      embed.setColor("RED")
      return message.channel.send(embed);
    }
    if(!args[0]) {
      embed.setAuthor(`El volumen actual es ${serverQueue.volume}`)
      return message.channel.send(embed)
    }
    if(isNaN(args[0])) {
      embed.setAuthor("Solo puede poner numeros", this.client.errorURL)
      return message.channel.send(embed)
    }
    let countVolumen = parseInt(args[0]);

    if(countVolumen > 200) {
      embed.setAuthor("El maximo es 200 para el volumen")
      return message.channel.send(embed)
    }
    serverQueue.volume = countVolumen
    serverQueue.connection.dispatcher.setVolumeLogarithmic(countVolumen / 100)
    embed.setDescription(`Volumen establecido a ${args[0]}`)
    embed.setThumbnail(this.client.user.displayAvatarURL())
    message.channel.send(embed)    
}
}