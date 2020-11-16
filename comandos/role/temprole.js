import Command from '../../utils/comando.js';
import Discord from 'discord.js';
import config from '../../config/bot.json';
import ms from "ms";
import quick from "quick.db";
const db = new quick.table("temp_role");
import moment from "moment";
import momentDurationFormat from "moment-duration-format";
export default class extends Command {
  constructor(options){
    super(options)
    this.usage = "temprole <@member> <time> <role>";
  }
 async run(message, args){
       const error = new Discord.MessageEmbed()
      .setAuthor(
        `Uso adecuado: ${this.usage}`,
        this.client.errorURL
      )
      .setColor("RED");
          const embed = new Discord.MessageEmbed()

       if (!message.member.hasPermission("MANAGE_ROLES"))
      return message.channel.send(
        "No tienes permisos para utilizar este comando"
      );
      if(!message.guild.me.hasPermission("MANAGE_ROLES")) return message.channel.send("Nesesito permisos de dar roles")

   const memberID = args[0] ? args[0].match(/(?<=(<@!?))(\d{17,19})(?=>)/g) : null;
   const member = memberID ? message.guild.members.resolve(memberID[0]) : message.guild.members.resolve(args[0]);
   if(!member) return message.channel.send(error);
   if(!args[1]) return message.channel.send(error);
   const timefinnaly = ms(args[1]);
   if(typeof timefinnaly === "undefined") return message.channel.send("El tiempo no es valido")
   if(timefinnaly < 1000) return message.channel.send("poco tiempo");
   const roleID = args[2] ? args[2].match(/(?<=(<@&))(\d{17,19})(?=>)/g) : null;
   const role = roleID ? message.guild.roles.resolve(roleID[0]) : message.guild.roles.resolve(args[2]);
   if(!role) return message.channel.send(error);
   if(member.roles.cache.has(role.id)) return message.channel.send("El mimbro ya tiene ese rol");
   if(message.member.roles.highest.position <= role.position) return message.channel.send("El rol que intenta dar esta en mayor jerarquia que la de usted")
   if(message.guild.me.roles.highest.position <= role.position) return message.channel.send("El rol que intenta dar esta en mayor que mi jerarquia")
   db.push(`${message.guild.id}.members`, { 
    roleID: role.id, 
    memberID: member.id,
    guildID: message.guild.id, 
    time: Date.now() + timefinnaly
   });
   embed.setTitle("Rol temporal agregado");
   embed.setDescription(`<@${member.id}> se le a entregado el rol durante ${moment.duration(timefinnaly).format("y [years], w [weeks], d [days], h [hours], m [minutes], s [seconds]")}`)
   embed.setColor("GREEN");
   await member.roles.add(role)
   await message.channel.send(embed)
  }
}