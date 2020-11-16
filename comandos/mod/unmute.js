import Command from '../../utils/comando.js';
import Discord from 'discord.js';
import config from '../../config/bot.json';
import util from 'util';
import ms from "ms";
import quick from "quick.db";
const db2  = new quick.table("mute_role");
export default class extends Command {
  constructor(options){
    super(options)
    this.usage = "mute <@member/ID> [time] [reason]";
  }
  async run(message, args){
  const embed = new Discord.MessageEmbed();
  const muterole = await db2.fetch(`muterole_${message.guild.id}`);
  const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
  if(!message.guild.me.hasPermission("MANAGE_ROLES")){
    embed.setAuthor(`No puedo mutear por falta de permiso de gestionar roles`,this.client.errorURL)
    embed.setColor("RED");
    return message.channel.send(embed)
  };  
  if(!message.member.hasPermission('MANAGE_ROLES')){
    embed.setAuthor(`Nesesitas permisos para poder usar este comando`,this.client.errorURL)
    embed.setColor("RED");
    return message.channel.send(embed)
  }
  if(!target) {
    embed.setAuthor(`Uso adecuado: ${this.usage}`,this.client.errorURL)
    embed.setColor("RED");
    return message.channel.send(embed)
  }
  if(target.roles.highest.position >= message.member.roles.highest.position) {
    embed.setAuthor(`No puedes desmutear a alguien de mayor o igual jerarquia que la de usted`,this.client.errorURL)
    embed.setColor("RED");
    return message.channel.send(embed)
  };
  if(!target.manageable) {
    embed.setAuthor(`No puedo desmutear a alguien de igual o por encima de mi jerarquia de roles`,this.client.errorURL)
    embed.setColor("RED");
    return message.channel.send(embed)
  };
    target.roles.remove(muterole)
    await message.channel.send(`Usuario desmuteado **${target.user.tag}**`);
}
}