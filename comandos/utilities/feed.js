import Command from '../../utils/comando.js';
import Discord from 'discord.js';
import config from '../../config/bot.json';
import quick from 'quick.db'
const db = new quick.table("feed");

export default class extends Command {
  constructor(options){
    super(options)
    this.usage = "feed";
  }
 async run(message, args){
  if(!message.member.hasPermission('MANAGE_GUILD')) return;
   const feed = db.fetch(message.guild.id)
   if(!args.length) {
     if(feed && feed.feeds && feed.feeds.length) {
       const embed = new Discord.MessageEmbed();
       embed.setTitle(`Feed de ${message.guild.name}`)
       feed.feeds.map(a => {
        embed.addField(a.title, `**Role:** <@&${a.role}>\n**Channel:** <#${a.channel}>`, true)
      })
    embed.setColor("#6e83d0");
      return message.channel.send(embed)
     } else {
       message.channel.send(`Este servidor no tiene feed configurados , utilize \`${message.content+ " create"}\` para empezar`)
     }
   } else if (args[0] === "create") {
     const role = message.mentions.roles.first();
     let id = args[2] ? args[2].match(/(?<=(<@&))(\d{17,19})(?=>)/g) : null;
     if(!args[1]) return message.channel.send("DI un titulo");
     if(feed && feed.feeds && feed.feeds.length && feed.feeds.find(a => a.title === args[1])) return message.channel.send("Ya existe un feed con ese nombre")
     let user = id ? message.guild.members.resolve(id[0]) : message.guild.members.resolve(args[2]);
     if(!role) message.channel.send("Menciona un rol");
     db.push(`${message.guild.id}.feeds`, { title: args[1], role: role.id, channel: message.channel.id})     
     message.channel.send(`¡Éxito! Se ha creado el feed ${args[1]}`)
   } else if (args[0] === "announce") {
     if(!args[1]) return message.channel.send("Di el nombre del feed");
     const announce = args.slice(2).join(" ");
     if(!announce) return message.channel.send("Du el anuncion")
     if(feed && feed.feeds && feed.feeds.length && feed.feeds.find(a => a.title === args[1])) {
       const feed_find = feed.feeds.find(a => a.title === args[1])
       if(!message.guild.roles.resolve(feed_find.role)) return message.channel.send("Parece que ese rol ya no existe :()")
       const channel = message.guild.channels.resolve(feed_find.channel) 
       channel.send(`${message.guild.roles.resolve(feed_find.role)}: ${announce}`)
     } else {
       message.channel.send("El feed no existe")
     }
   } else if (args[0] === "delete" || args[0] === "-" || args[0] === "del" || args[0] === "remove") {
      if(!args[1]) return message.channel.send("Di el nombre del feed");
      if(feed && feed.feeds && feed.feeds.length && feed.feeds.find(a => a.title === args[1])) {
      await db.set(`${message.guild.id}.feeds`, feed.feeds.filter(a => a.title !== args[1]))
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
     if(!args[1]) return message.channel.send("di el titulo para buscar")
    let id = args[2] ? args[2].match(/(?<=(<#))(\d{17,19})(?=>)/g) : null;
    let canal = id ? message.guild.channels.resolve(id[0]) : message.guild.channels.resolve(args[2]);
     if(!canal) return message.channel.send("mencione un canal");
      if(feed && feed.feeds && feed.feeds.length && feed.feeds.find(a => a.title === args[1])) {
      const feed_find = feed.feeds.find(a => a.title === args[1])
      const number = feed.feeds.indexOf(feed_find)
      feed.feeds[number] = { title: args[1], role: feed_find.role , channel: canal.id}
      await db.set(`${message.guild.id}.feeds`, feed.feeds)
        message.channel.send("Feed editado "+ args[1])
     } else {
       message.channel.send("El feed no existe")
     }
   }
}
 }