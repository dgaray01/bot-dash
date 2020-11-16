import Command from '../../utils/comando.js';
import Discord from 'discord.js';
import quick from "quick.db";
const db = new quick.table("mute_role");

export default class extends Command {
  constructor(options){
    super(options)
    this.usage = "mute <@member/ID> [time] [reason]";
  }
  async run(message, args){
  const embed = new Discord.MessageEmbed();
    
  const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);
  if(!message.guild.me.hasPermission("MANAGE_ROLES")){
    embed.setAuthor(`No puedo establecer un rol por falta de permiso de gestionar roles`,this.client.errorURL)
    embed.setColor("RED");
    return message.channel.send(embed)
  };  
  if(!message.member.hasPermission('MANAGE_ROLES')){
    embed.setAuthor(`Nesesitas permisos para poder usar este comando`,this.client.errorURL)
    embed.setColor("RED");
    return message.channel.send(embed)
  }
  if(!role) {
    embed.setAuthor(`Uso adecuado: ${this.usage}`,this.client.errorURL)
    embed.setColor("RED");
    return message.channel.send(embed)
  }
    db.set(`muterole_${message.guild.id}`, role.id)
    message.channel.send(`Rol mute establecido: **${role}**`);
}
}
