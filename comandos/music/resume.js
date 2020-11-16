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
    this.usage = "resume";
  }
  async run(message, args){
    const queue = this.client.queue
  const serverQueue = this.client.queue.get(message.guild.id);
  const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.channel.send('¡Necesitas unirte a un canal de voz para reproducir música!');
        let embed = new Discord.MessageEmbed()
     if (!serverQueue) {
      embed.setAuthor("No hay nada que pueda reproducir en bucle ")
      embed.setColor("RED")
      return message.channel.send(embed);
    }
    serverQueue.playing = true;
    serverQueue.connection.dispatcher.resume();
    return message.channel.send("**¡Reanudando!**");
}
}