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
    this.usage = "summon <#channel/id/name>";
  }
  async run(message, args){
    const channel_name = args[0].toLowerCase()
  const voiceChannel =
    message.mentions.channels.first() ||
    message.guild.channels.resolve(args[0]) ||
    message.guild.channels.cache.find(channels => channels.name.startsWith(args[0]));
  const embed = new Discord.MessageEmbed();
  if(!voiceChannel) {
    embed.setAuthor(`Uso adecuado: ${this.usage}`,this.client.errorURL)
    embed.setColor("RED");
    return message.channel.send(embed)
  };
  if (voiceChannel.type !== "voice") {
    embed.setAuthor(`El canal deve de ser un canal de voz`,this.client.errorURL)
    embed.setColor("RED");
    return message.channel.send(embed)
    };
  const permissions = voiceChannel.permissionsFor(this.client.user);
  if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) return message.channel.send('¡Necesito permisos para unirme y/o hablar en el canal de Voz!');
    await voiceChannel.join();
    embed.setDescription(`Me uni al canal de voz ${voiceChannel}`)
    message.channel.send(embed)
}
}