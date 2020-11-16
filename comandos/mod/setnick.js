import Command from '../../utils/comando.js';
import Discord from 'discord.js';
import config from '../../config/bot.json';
import util from 'util';
import ms from "ms";
import quick from "quick.db";
const db = new quick.table("mute_role");

export default class extends Command {
  constructor(options){
    super(options)
    this.usage = "setnick <member> <name>";
  } 
  async run(message, args){
    const embed = new Discord.MessageEmbed();
    const user = args[0].toLowerCase()
    const target =
        message.mentions.members.first() ||
        message.guild.members.resolve(args[0]) ||
        message.guild.members.cache.find(member => member.nickname && member.nickname.toLowerCase().startsWith(user)) ||
        message.guild.members.cache.find(member => member.user.username.toLowerCase().startsWith(user));
    const nickname = args.slice(1).join(" ");
  if(!message.guild.me.hasPermission("MANAGE_NICKNAMES")){
    embed.setAuthor(`No puedo establecer un rol por falta de permiso de gestionar nickname`,this.client.errorURL)
    embed.setColor("RED");
    return message.channel.send(embed)
  };  
  if(!message.member.hasPermission('MANAGE_NICKNAMES')){
    embed.setAuthor(`Nesesitas permisos para poder usar este comando`,this.client.errorURL)
    embed.setColor("RED");
    return message.channel.send(embed)
  };
  if(!target) {
    embed.setAuthor(`Usuario no encontrado con el nombre ${args[0]}`,this.client.errorURL)
    embed.setColor("RED");
    return message.channel.send(embed)     
  };
  if(target.roles.highest.position >= message.member.roles.highest.position) {
    embed.setAuthor(`No puedo editar apodos de miembros encima de usted`,this.client.errorURL)
    embed.setColor("RED");
    return message.channel.send(embed)
  };
  if(!target.manageable) {
    embed.setAuthor(`No puedo cambiar apodos a miembros por encima de mi`,this.client.errorURL)
    embed.setColor("RED");
    return message.channel.send(embed)
  };
  if(nickname.length >= 32) {
    embed.setAuthor(`No puedo ponerle ese apodo`,this.client.errorURL)
    embed.setColor("RED");   
    return message.channel.send(embed) 
  };
  if(!nickname) {
    embed.setAuthor(`falta que pongas apodo`,this.client.errorURL)
    embed.setColor("RED");   
    return message.channel.send(embed) 
  }
    target.setNickname(nickname)
    await message.channel.send(`El apodo de ${target.user.username} ha sido establecido a ${nickname}`);
}
}
