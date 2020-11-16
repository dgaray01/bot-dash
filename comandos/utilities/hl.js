import Command from '../../utils/comando.js';
import Discord from 'discord.js';
import config from '../../config/bot.json';
import quick from 'quick.db'
const db = new quick.table("highlights");

export default class extends Command {
  constructor(options){
    super(options)
    this.usage = "hl";
  }
 async run(message, args){
  if(!message.member.hasPermission('MANAGE_MESSAGES')) return;
   const hl = db.fetch(message.guild.id)
   if(!args.length) {
     if(hl && hl.feeds && hl.feeds.length) {
       const embed = new Discord.MessageEmbed();
       embed.setTitle(`Highlights de ${message.guild.name}`)
       let i = 0
       hl.feeds.map(a => {
         i++
        embed.addField(`Highlight ${i}`, `**Palabra:** ${a.title} \n **Notificando a:** ${this.client.users.cache.get(a.user)}`, true)
      })
//no he probado 
    embed.setColor("#6e83d0");
      return message.channel.send(embed)
     } else {
       message.channel.send(`No has hecho ningun highlight para este servidor, utilize \`${message.content+ " add"}\` para crear uno`)
     }
     //silencio, fuera de aca
   } else if (args[0] === "add") {
     if(!args[1]) return message.channel.send("Di una palabra para agregar");
     if(hl && hl.feeds && hl.feeds.length && hl.feeds.find(a => a.title === args[1])) return message.channel.send("Ya existe un highlight con ese nombre en tu lista")
     db.push(`${message.guild.id}.feeds`, { title: args[1], user: message.author.id})     
     message.channel.send(`¡Éxito! Se ha creado el highlight ${args[1]}`)
   } else if (args[0] === "match") {
     if(!args[1]) return message.channel.send("Di un texto a comparar");
     const matchEmbed = new Discord.MessageEmbed()
     matchEmbed.setColor("RANDOM")
   if(hl && hl.feeds && hl.feeds.length && hl.feeds.find(a =>  args.includes(a.title)))  {//hl && hl.feeds && hl.feeds.length tienes que verificar tood eso
     matchEmbed.setAuthor("Palabra encontrada")
   } else {
          matchEmbed.setAuthor("No se encontraron palabras")
   }
          message.channel.send(matchEmbed)
   } else if (args[0] === "delete" || args[0] === "-" || args[0] === "del" || args[0] === "remove") {
      if(!args[1]) return message.channel.send("Di el nombre del highlight");
      if(hl && hl.feeds && hl.feeds.length && hl.feeds.find(a => a.title === args[1])) {
      await db.set(`${message.guild.id}.feeds`, hl.feeds.filter(a => a.title !== args[1]))
        message.channel.send("Highlight Removido "+ args[1])
     } else {
       message.channel.send("El feed no existe")
     }
   } else if (args[0] === "clear") {
     const embed = new Discord.MessageEmbed()
     embed.setColor("ORANGE");
     embed.setTitle("Confirmacion");
     embed.setDescription("Seguro que quieres borrar todos los highlights?")
     const msg = await message.channel.send(embed)
     await msg.react("✅")
     await msg.react("❎");
     await msg.awaitReactions((reaction, user) => ["✅", "❎"].includes(reaction.emoji.name) && user.id == message.author.id, {max: 1})
    .then(async awa => {
       const reaction = awa.first()
       if(reaction.emoji.name === "✅") {
         embed.setColor("GREEN");
     embed.setTitle("Exitoso");
     embed.setDescription("Todas las highlights se eliminaron del servidor")
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
   } 
}
 }