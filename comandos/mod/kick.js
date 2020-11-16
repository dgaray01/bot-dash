import Command from '../../utils/comando.js';
import Discord from 'discord.js';
import config from '../../config/bot.json';
import util from 'util';

export default class extends Command {
  constructor(options){
    super(options)
    this.usage = "kick <@member/ID> [reason]";
  }
  async run(message, args){
  const embed = new Discord.MessageEmbed();
    
  const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
  let reason = args.slice(1).join(" ") || `${message.author.username} ha expulsado a este usuario`;
  if(!message.guild.me.hasPermission('KICK_MEMBERS')){
    embed.setAuthor(`No puedo expulsar miembros por falta de permisos`,this.client.errorURL)
    embed.setColor("RED");
    return message.channel.send(embed)
  };  
  if(!message.member.hasPermission('KICK_MEMBERS')){
    embed.setAuthor(`Nesesitas permisos para poder usar este comando`,this.client.errorURL)
    embed.setColor("RED");
    return message.channel.send(embed)
  }
  let id = args[0] ? args[0].match(/(?<=(<@!?))(\d{17,19})(?=>)/g) : null;
  let user = id ? message.guild.members.resolve(id[0]) : message.guild.members.resolve(args[0]);
  if(!user) {
    embed.setAuthor(`Uso adecuado: ${this.usage}`,this.client.errorURL)
    embed.setColor("RED");
    return message.channel.send(embed)
  }
  if(target.roles.highest.position >= message.member.roles.highest.position) {
    embed.setAuthor(`No puedes expulsar a alguien de mayor o igual jerarquia que la de usted`,this.client.errorURL)
    embed.setColor("RED");
    return message.channel.send(embed)
  }
  if(!target.kickable) {
    embed.setAuthor(`No puedo expulsar a alguien de igual o por encima de mi jerarquia de roles`,this.client.errorURL)
    embed.setColor("RED");
    return message.channel.send(embed)
  }
    await target.kick(reason)
    message.channel.send(`Usuario Expulsado **${target.user.tag}**`)
  }
  }