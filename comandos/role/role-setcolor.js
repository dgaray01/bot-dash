

import Command from '../../utils/comando.js';
import Discord from 'discord.js';
import config from '../../config/bot.json';


export default class extends Command {
  constructor(options){
    super(options)
    this.usage = "role-setcolor <#HEX> <@ROLE / ROLE ID>";
  }
 async run(message, args){
       const error = new Discord.MessageEmbed()
      .setAuthor(
        `Uso adecuado: ${this.usage}`,
        this.client.errorURL
      )
      .setColor("RED");

       if (!message.member.hasPermission("MANAGE_ROLES", "ADMINISTRADOR"))
      return message.channel.send(
        "No tienes permisos para utilizar este comando"
      );
   if(!args[0]) return message.channel.send(error)
    let role =
      message.mentions.roles.first() ||
      message.guild.roles.cache.find(r => r.id == args[1]);
   
      if(!role) return message.channel.send(error)
   
    if(!args[0].match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/g)) return message.channel.send("Ese no es un color HEX")
   
        if (!role.editable) return message.channel.send("Rol mas alto que el mio");
   
   const embed = new Discord.MessageEmbed()
   .setAuthor("Color cambiado")
   .setColor(args[0])
   .setDescription("```" + role.hexColor + " > "+ args[0] + "```")
   message.channel.send(embed)
   role.setColor(args[0])
  }
}