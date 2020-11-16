import Command from '../../utils/comando.js';
import Discord from 'discord.js';
import config from '../../config/bot.json';
import util from 'util';
import ms from "ms";
export default class extends Command {
  constructor(options){
    super(options)
    this.usage = "lock-channel";
  }
  async run(message, args) {
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
                    SEND_MESSAGES: false
                })
    await message.channel.setName(message.channel.name += `🔒`)
    await message.channel.send(`El canal a sido bloqueado ${message.channel}`);
}
}

