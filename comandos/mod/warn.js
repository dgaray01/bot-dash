import Command from '../../utils/comando.js';
import Discord from 'discord.js';
import config from '../../config/bot.json';
import util from 'util';
import db from "quick.db";
export default class extends Command {
  constructor(options){
    super(options)
    this.usage = "warn <@member/ID> [reason]";
  }
  async run(message, args){
  const embed = new Discord.MessageEmbed();
  const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
  if(!message.member.hasPermission('ADMINISTRATOR')){
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
  };
  // if(target.user.bot) {
  //   embed.setAuthor(`No puede dar warn a un bot`,this.client.errorURL)
  //   embed.setColor("RED");
  //   return message.channel.send(embed)
  // };
  if(user.id === message.author.id) {
    embed.setAuthor(`No puede dar warn a si mismo`,this.client.errorURL)
    embed.setColor("RED");
    return message.channel.send(embed)
  };
  let reason = args.slice(1).join(" ") || "Razón no especificada";
  if(target.roles.highest.position >= message.member.roles.highest.position) {
    embed.setAuthor(`No puedes dar warn alguien de mayor o igual jerarquia que la de usted`,this.client.errorURL)
    embed.setColor("RED");
    return message.channel.send(embed)
  };
  let warning = db.fetch(`warnings_${message.guild.id}_${target.id}`)
  if(warning > 2){
    target.ban({reason: "Por acomular 3 warnings"})
  await message.channel.send(`El usuario ${target.user.username}`)
  }
  if(warning === null){
    db.set(`warnings_${message.guild.id}_${target.id}`, 1)
    await message.channel.send(`Nuevo usuario warneado ${target.user.id}`)
  };
  if(warning !== null){
    db.add(`warnings_${message.guild.id}_${target.id}`, 1)
    await message.channel.send(`Nuevo usuario warneado xd ${target.user.id}`)
  }
}
}