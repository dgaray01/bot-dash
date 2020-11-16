import Command from '../../utils/comando.js';
import Discord from 'discord.js';
import config from '../../config/bot.json';
import util from 'util';
import ms from "ms";
import quick from "quick.db";
const db = new quick.table("mute");
const db2 = new quick.table("mute_role");

export default class extends Command {
  constructor(options){
    super(options)
    this.usage = "lock-channel";
  }
  async run(message, args){
  const embed = new Discord.MessageEmbed();
  if(!message.guild.me.hasPermission("ADMINISTRATOR")){
    embed.setAuthor(`No puedo bloquear por falta de permisos`,this.client.errorURL)
    embed.setColor("RED");
    return message.channel.send(embed)
  };  
  if(!message.member.hasPermission('ADMINISTRATOR')){
    embed.setAuthor(`Nesesitas permisos para poder usar este comando`,this.client.errorURL)
    embed.setColor("RED");
    return message.channel.send(embed)
  }
    message.channel.updateOverwrite(message.guild.roles.everyone, { 
                    SEND_MESSAGES: true
                })
    await message.channel.setName(message.channel.name.replace(/\s*🔒/, ''))
    message.channel.send(`El canal a sido desbloqueado ${message.channel}`);
}
}