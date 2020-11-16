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
    this.usage = "skip";
  }
  async run(message, args){

  const queue = this.client.queue
  const serverQueue = this.client.queue.get(message.guild.id);
  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel) return message.channel.send('¡Necesitas unirte a un canal de voz para reproducir música!');
  const embed = new Discord.MessageEmbed()
  if (!serverQueue ) {
      embed.setAuthor("No hay nada que pueda reproducir en bucle ")
      embed.setColor("RED")
      return message.channel.send(embed);
  };
  if(!message.member.hasPermission('ADMINISTRATOR')){
    const vote = this.client.vote.get(message.guild.id)
    const vcvote = Math.floor(message.guild.me.voice.channel.members.size / 2)
    const okie = Math.floor(message.guild.me.voice.channel.members.size / 2 - 1)
    // if(!message.member.hasPermission("ADMINISTRATOR")) {
       if(vote.vote > okie) {
         serverQueue.connection.dispatcher.end();
    embed.setDescription("VOTAR - SALTAR | Saltarse la canción")
    embed.setThumbnail(this.client.user.displayAvatarURL())
    return message.channel.send(embed);
       }
       if(vote.voters.includes(message.author.id)) {
         return message.channel.send("Ya votaste por esta canción ")
       }
       if(vcvote === 2) {
          serverQueue.connection.dispatcher.end();
    embed.setDescription("✔ | Skipping The Song")
    embed.setThumbnail(this.client.user.displayAvatarURL())
    return message.channel.send(embed);
       }
vote.vote++
       vote.voters.push(message.author.id)
       return message.channel.send(`Votaste para que la canción se salte, por cierto, actualmente necesitamos ${Math.floor (vcvote - vote.vote)} votos`)
}
    serverQueue.connection.dispatcher.end();
    embed.setDescription("✔ | Skipping The Song")
    embed.setThumbnail(this.client.user.displayAvatarURL())
    message.channel.send(embed);
}
}