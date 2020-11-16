import Discord from 'discord.js';
import Command from '../../utils/comando.js';
import quick from "quick.db";
import ms from "ms";
import moment from "moment";
import momentDurationFormat from "moment-duration-format";
export default class extends Command {
  constructor(options){
    super(options)
    this.usage = "[tr|timedrole]";
    this.aliases = ["tr"]
  }
  async run(message, args){
    const embed = new Discord.MessageEmbed();
    const db = new quick.table("roles_delay");
    const time_roles = db.fetch(message.guild.id)
    if(!args.join(" ")) {
      embed.setTitle("Roles cronometrados");
      if(time_roles && time_roles.timeroles && time_roles.timeroles.length) {
        embed.setDescription(time_roles.timeroles.map(a => `**${moment.duration(a.time).format("y [years], w [weeks], d [days], h [hours], m [minutes], s [seconds]")}** ${message.guild.roles.resolve(a.role)}`))
      }
      embed.setColor("#6e83d0");
      message.channel.send(embed)
    }
    if(args[0] === "add" || args[0] === "+") {
        if(!args[1]) {
          embed.setAuthor(`Uso adecuado: timedrole [add|+] <time> <role>`,this.client.errorURL)
          embed.setColor("RED");
          return message.channel.send(embed)
        };
        if(!args[1].endsWith("d") && !args[1].endsWith("h") && !args[1].endsWith("m")) return message.channel.send(`No Pusiste Un Formato De Tiempo Correcto`)
        if(isNaN(args[1][0])) return message.channel.send(`Eso No es Un Número`);
        if(ms(args[1]) <= 1000) return message.channel.send("El tiempo deve ser mayor a 1 segundo") 
        if(typeof ms(args[1]) === "undefined") return message.channel.send("Hubo un error en el tiempo");
        const role = message.mentions.roles.first();
        if(!role) return message.channel.send("Nesesita mencionar un rol");
        if(role.position >= message.member.roles.highest.position) return message.channel.send("El rol que intenta poner es de la misma o mayor jerarquia que su rol mas alto");
        if(role.managed) return message.channel.send("No puede gestionar ese rol");
        if(time_roles && time_roles.timeroles && time_roles.timeroles.length && time_roles.timeroles.find(a => a.role === role.id)) {
        const los_roles = time_roles.timeroles.indexOf(time_roles.timeroles.find(a => a.role === role.id));
        time_roles.timeroles[los_roles] = { time: ms(args[1]), role: role.id }
        await db.set(`${message.guild.id}.timeroles`, time_roles.timeroles);
        embed.setTitle("Rol con delay agregado");
        embed.setDescription(`Añadido ${role} con un delay de ${moment.duration(ms(args[1])).format("y [years], w [weeks], d [days], h [hours], m [minutes], s [seconds]")}`)
        message.channel.send(embed)
      } else {
        await db.push(`${message.guild.id}.timeroles`, { time: ms(args[1]), role: role.id })
        embed.setTitle("Rol con delay agregado");
        embed.setColor("GREEN")
        embed.setDescription(`Añadido ${role} con un delay de ${moment.duration(ms(args[1])).format("y [years], w [weeks], d [days], h [hours], m [minutes], s [seconds]")}`)
      message.channel.send(embed)
      }
    };
    if(args[0] === "remove") {
      const role = message.mentions.roles.first();
      if(!args[1]) {
          embed.setAuthor(`Uso adecuado: timedrole remove <role>`,this.client.errorURL)
          embed.setColor("RED");
          return message.channel.send(embed)
      };
      if(time_roles && time_roles.timeroles && time_roles.timeroles.length && time_roles.timeroles.find(a => a.role === role.id)) {
          const los_roles = time_roles.timeroles.filter(a => a.role !== role.id);
        await db.set(`${message.guild.id}.timeroles`, los_roles);
        embed.setTitle("Rol con delay removido");
        embed.setDescription(`${role} removido`);
        embed.setColor("RED")
        message.channel.send(embed)
      } else {
        message.channel.send("El rol no fue asignado previamente")
      }
    }
  }
}