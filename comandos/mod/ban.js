import Command from '../../utils/comando.js';
import Discord from 'discord.js';
import config from '../../config/bot.json';
import util from 'util';

export default class extends Command {
  constructor(options){
    super(options)
    this.usage = "ban <@member/ID> [days=2] [reason]";
  }
  async run(message, args){
  const embed = new Discord.MessageEmbed();
    
  const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
  let delete_days = args[1];
  let reason = args.slice(2).join(" ") || `${message.author.username} ha baneado a este usuario`;
  if(!message.guild.me.hasPermission('BAN_MEMBERS')){
    embed.setAuthor(`No puedo banear por falta de permisos`,this.client.errorURL)
    embed.setColor("RED");
    return message.channel.send(embed)
  };  
  if(!message.member.hasPermission('BAN_MEMBERS')){
    embed.setAuthor(`Nesesitas permisos para poder usar este comando`,this.client.errorURL)
    embed.setColor("RED");
    return message.channel.send(embed)
  };
  let id = args[0] ? args[0].match(/(?<=(<@!?))(\d{17,19})(?=>)/g) : null;
  let user = id ? message.guild.members.resolve(id[0]) : message.guild.members.resolve(args[0]);
  if(!user) {
    embed.setAuthor(`Uso adecuado: ${this.usage}`,this.client.errorURL)
    embed.setColor("RED");
    return message.channel.send(embed)
  }
  if(isNaN(parseInt(delete_days)) || parseInt(delete_days) >= 8 || parseInt(delete_days) <= 0) {
    delete_days = null
    reason = args.slice(1).join(" ") || `${message.author.username} ha baneado a este usuario`;
  }
  if(target.roles.highest.position >= message.member.roles.highest.position) {
    embed.setAuthor(`No puedes banear alguien de mayor o igual jerarquia que la de usted`,this.client.errorURL)
    embed.setColor("RED");
    return message.channel.send(embed)
  }
  if(!target.bannable) {
    embed.setAuthor(`No puedo banear alguien de mayor o por encima de mi jerarquia de roles`,this.client.errorURL)
    embed.setColor("RED");
    return message.channel.send(embed)
  }
    if(!delete_days) {
    await target.ban({reason: reason})
    } else {
    await target.ban({ days: delete_days, reason: reason})
    }
    message.channel.send(`Usuario baneado **${target.user.tag}**`)
  }
  }