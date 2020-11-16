import Command from '../../utils/comando.js';
import Discord from 'discord.js';
import config from '../../config/bot.json';
import quick from 'quick.db'
import ms from "ms";
import moment from "moment";
import momentDurationFormat from "moment-duration-format";

export default class extends Command {
  constructor(options){
    super(options)
    this.usage = "feed";
    this.aliases = ["af"]
  }
  async run(message, args){
    if(!message.member.hasPermission('MANAGE_GUILD')) return;
    const db = new quick.table("auto_feed");
    const autofeed = db.fetch(message.guild.id);
    if(!args.length) {
      if(autofeed && autofeed.feeds && autofeed.feeds.length) {
      const embed = new Discord.MessageEmbed();
      embed.setTitle(`Feed de ${message.guild.name}`)
      autofeed.feeds.slice(0, 25).map(a => {
        if(!!a.infinity) {
          embed.addField(`#${a.ID}`, `
            **Canal:** <#${a.channelID}>
            **Rol:** ${!!a.silent ? "silent" : `<@&${a.roleID}>`}
            **Repetición**: ${"cada " + moment.duration(a.time).format("d [days] hh:mm:ss")}
            **Siguiente anuncio:** ${moment.duration(a.time_send - Date.now()).format("y [years], w [weeks], d [days], h [hours], m [minutes], s [seconds]")}
            **Contenido:** ${a.message}`, true)
        } else {
        embed.addField(`#${a.ID}`, `
            **Canal:** <#${a.channelID}>
            **Rol:** ${!!a.silent ? "silent" : `<@&${a.roleID}>`}
            **Siguiente anuncio:** ${moment.duration(a.time_send - Date.now()).format("y [years], w [weeks], d [days], h [hours], m [minutes], s [seconds]")}
            **Contenido:** ${a.message}`, true)
        }
      })
      embed.setColor("#6e83d0");
      return message.channel.send(embed)
     } else {
       return message.channel.send(`Este servidor no tiene feed configurados , utilize \`${message.content+ " create"}\` para empezar`)
     }
   }
   if(args[0] === "create") {
     const id = args[1] ? args[1].match(/(?<=(<@&))(\d{17,19})(?=>)/g) : null;
     const role = id ? message.guild.roles.resolve(id[0]) : message.guild.roles.resolve(args[1]);
     if(!role) return message.channel.send("Menciona un rol");
     if(!args[2]) return message.channel.send("DI un tiempo");
     if(!args[3]) return message.channel.send("DI un mensaje");
     const  timefinnaly = ms(args[2]);
     if(typeof timefinnaly === "undefined") {
      return message.channel.send("El tiempo no es valido")
     };
     if(timefinnaly < 1000) return message.channel.send("poco tiempo");
     const el_objecto = {
      ID: (Date.now()).toString(),
      time: timefinnaly,
      time_send: Date.now() + timefinnaly,
      roleID: role.id, 
      message: args.slice(2).join(" "),
      infinity: false, 
      silent: false,
      channelID: message.channel.id, 
      guildID: message.guild.id
    }   
    await db.push(`${message.guild.id}.feeds`, el_objecto)
    await message.channel.send(`Éxito, se ha creado la alimentación automática con el ID ${el_objecto.ID}`)
   } else if(args[0].match(/(?<=(<@&))(\d{17,19})(?=>)/g)) {
     const id = args[0] ? args[0].match(/(?<=(<@&))(\d{17,19})(?=>)/g) : null;
     const role = id ? message.guild.roles.resolve(id[0]) : message.guild.roles.resolve(args[0]);
     if(!role) return message.channel.send("Menciona un rol");
     if(!args[1]) return message.channel.send("DI un tiempo");
     if(!args[2]) return message.channel.send("DI un mensaje");
     const timefinnaly = ms(args[1]);
    if(typeof timefinnaly === "undefined") {
      return message.channel.send("El tiempo no es valido")
    };
     if(timefinnaly < 1000) return message.channel.send("poco tiempo");
     const el_objecto = {
      ID: (Date.now()).toString(),
      time: timefinnaly,
      time_send: Date.now() + timefinnaly,
      roleID: role.id, 
      message: args.slice(2).join(" "),
      infinity: false, 
      silent: false,
      channelID: message.channel.id, 
      guildID: message.guild.id,
    }    
    db.push(`${message.guild.id}.feeds`, el_objecto)
    await message.channel.send(`Éxito, se ha creado la alimentación automática con el ID **${el_objecto.ID}**`)
   } else if(args[0] === "silent") {
    if(!args[1]) return message.channel.send("DI un tiempo");
    const timefinnaly = ms(args[1]);
    if(typeof timefinnaly === "undefined") {
      return message.channel.send("El tiempo no es valido")
    };
     if(timefinnaly < 1000) return message.channel.send("poco tiempo");
    if(!args[2]) return message.channel.send("DI un mensaje");
    const el_objecto = {
      ID: (Date.now()).toString(),
      time: timefinnaly,
      time_send: Date.now() + timefinnaly,
      message: args.slice(2).join(" "),
      infinity: false, 
      silent: true,
      channelID: message.channel.id, 
      guildID: message.guild.id
    }
    await db.push(`${message.guild.id}.feeds`, el_objecto)
    await message.channel.send(`Éxito, se ha creado la alimentación automática con el ID **${el_objecto.ID}**`)
   } else if (args[0] === "silence") {
      if(!args[1]) return message.channel.send("Di el nombre del autofeed");
      if(autofeed && autofeed.feeds && autofeed.feeds.length && autofeed.feeds.find(a => a.ID=== args[1])) {
        const feed_find = autofeed.feeds.find(a => a.ID === args[1])
        const number = autofeed.feeds.indexOf(feed_find)
        autofeed.feeds[number].silent = true
        db.set(`${message.guild.id}.feeds`, autofeed.feeds)
       return message.channel.send(`El autofeed esta exitosamente silecionado ${feed_find.ID}`)
     } else {
       message.channel.send("El feed no existe")
     }
    } else if (args[0] === "repeat") {
        if(!args[1]) return message.channel.send("Di una ID");
        if(!args[2]) return message.channel.send("Di un tiempo para el intervalo de tiempo del autofeed");
        if(autofeed && autofeed.feeds && autofeed.feeds.length && autofeed.feeds.find(a => a.ID === args[1])) {
        const feed_find = autofeed.feeds.find(a => a.ID === args[1]);
        const number = autofeed.feeds.indexOf(feed_find)
        const timefinnaly = ms(args[2]);
        if(typeof timefinnaly === "undefined") return message.channel.send("El tiempo no es valido")
        //if(timefinnaly < 3600000) return message.channel.send("El tiempo es menor de una hora");
        if(!feed_find.infinity) {
          autofeed.feeds[number].infinity = true;
          autofeed.feeds[number].time = timefinnaly;
          autofeed.feeds[number].time_send = Date.now() + timefinnaly;
        }
       db.set(`${message.guild.id}.feeds`, autofeed.feeds)
       return message.channel.send(`El autofeed esta exitosamente infinito ${feed_find.ID}`)
      }
      }
     if(args[0]=== "remove") {
      if(!args[1]) return message.channel.send("Di el nombre del autofeed");
      if(autofeed && autofeed.feeds && autofeed.feeds.length && autofeed.feeds.find(a => a.ID=== args[1])) {
      await db.set(`${message.guild.id}.feeds`, autofeed.feeds.filter(a => a.ID !== args[1]))
        message.channel.send("Feed Removido "+ args[1])
     } else {
       message.channel.send("El feed no existe")
     }
    } else if (args[0] === "clear") {
     const embed = new Discord.MessageEmbed()
     embed.setColor("ORANGE");
     embed.setTitle("Confirmacion");
     embed.setDescription("Seguro que quieres borrar todas las feeds?")
     const msg = await message.channel.send(embed)
     await msg.react("✅")
     await msg.react("❎");
     await msg.awaitReactions((reaction, user) => ["✅", "❎"].includes(reaction.emoji.name) && user.id == message.author.id, {max: 1})
    .then(async awa => {
       const reaction = awa.first()
       if(reaction.emoji.name === "✅") {
         embed.setColor("GREEN");
     embed.setTitle("Exitoso");
     embed.setDescription("Todas las feeds se eliminaron del servidor")
         await db.delete(message.guild.id)
    await msg.edit(embed)
     } 
      if(reaction.emoji.name === "❎") {
      embed.setColor("RED");
     embed.setTitle("Cancelado");
     embed.setDescription("Se cancelo la solicitud")
    await msg.edit(embed)
       } 
     }
     ) 
   } else if (args[0] === "move") {
     if(!args[1]) return message.channel.send("di la id para buscar")
    let id = args[2] ? args[2].match(/(?<=(<#))(\d{17,19})(?=>)/g) : null;
    let canal = id ? message.guild.channels.resolve(id[0]) : message.guild.channels.resolve(args[2]);
     if(!canal) return message.channel.send("mencione un canal");
      if(autofeed && autofeed.feeds && autofeed.feeds.length && autofeed.feeds.find(a => a.ID === args[1])) {
      const feed_find = autofeed.feeds.find(a => a.ID  === args[1])
      const number = autofeed.feeds.indexOf(feed_find)
      autofeed.feeds[number].channel = canal.id
      await db.set(`${message.guild.id}.feeds`, autofeed.feeds)
       return message.channel.send("Feed editado "+ args[1])
     } else {
       message.channel.send("El feed no existe")
     }
   }}
}