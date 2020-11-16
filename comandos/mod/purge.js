import Command from '../../utils/comando.js';
import Discord from 'discord.js';
import quick from "quick.db";
const db = new quick.table("mute_role");
export default class extends Command {
  constructor(options){
    super(options)
    this.usage = "purge <option> <number>";
  } 
  async run(message, args) {
    const embed = new Discord.MessageEmbed();
    const options = [
      "bot",
      "contains",
      "user",
      "embeds",
      "emoji",
      "files",
      "images",
      "links",
      "pings",
      "humans",
      "reactions"
    ];
  if(!message.guild.me.hasPermission("MANAGE_MESSAGES")){
    embed.setAuthor(`No puedo borrar mensajes por falta de permiso`,this.client.errorURL)
    embed.setColor("RED");
    return message.channel.send(embed)
  };  
  if(!message.member.hasPermission('MANAGE_MESSAGES')){
    embed.setAuthor(`Nesesitas permisos para poder usar este comando`,this.client.errorURL)
    embed.setColor("RED");
    return message.channel.send(embed)
  };
  if(!args[0]) {
      let fields = [
      {name: "purge all [search=100]", "value": "Elimina todos los mensajes."},
      {name: "purge bot [search=100] [prefix]", "value": "Elimina los mensajes de un usuario de bot y los mensajes con su prefijo"},
      {name: "purge contains [search=100] <substr>", "value": "Elimina todos los mensajes que contienen una subcadena."},
      {name: "purge embeds [search=100]", value: "Elimina los mensajes que tienen incrustaciones"},
      {name: "purge emoji [search=100]", value: "Elimina todos los mensajes que contienen emojis personalizados"},
      {name: "purge files [search=100]", value: "Elimina los mensajes que tienen archivos adjuntos."},
      {name: "purge human [search=100]", value: "Elimina todos los mensajes que no son de bot."},
      {name: "purge images [search=100]", value: "Elimina los mensajes que tienen incrustaciones o archivos adjuntos."},
      {name: "purge links [search=100]", value: "Sin ayuda"},
      {name: "purge mentions [search=100]", value: "Sin ayuda"},
      {name: "purge reactions [search=100]", value: "Elimina todas las reacciones de los mensajes que las tienen."},
      {name: "purge user <member> [search=100]", value: "Removes all messages by the member."}
      ]
      const embed = new Discord.MessageEmbed();
      embed.setTitle("purge [member] [buscar]")
      embed.setDescription("Elimina mensajes (opcionalmente de un miembro). Consulte! Help purge para obtener una lista completa de las cosas que puede seleccionar. Ignora los mensajes anclado")
      embed.addFields(fields)
      embed.setColor("#788ccc");
    const msg = await message.channel.send(embed)

    }
  if(!options.includes(args[0]) && !isNaN(parseInt(args[0]))) {
    const number = parseInt(args[0])
    if(number >= 100 || number <= 0) return message.channel.send("El numero no puede ser menor a 0 ni mayor a 100")
    message.channel.bulkDelete(number)
    return message.channel.send(`${number} ${number !== 1 ? "mensajes eliminados" : "mensaje eliminado"}`)     
  };
    if(args[0] === options[2]){ 
    const user = args[1]
    const target =
    message.mentions.members.first() ||
    message.guild.members.resolve(args[1]) ||
    message.guild.members.cache.find(member => member.nickname && member.nickname.toLowerCase().startsWith(user)) ||
    message.guild.members.cache.find(member => member.user.username.toLowerCase().startsWith(user));
  let number2 = parseInt(args[2])
  if(!args[2]) number = 100;
  if(isNaN(number2)) return message.channel.send("No se permite caracteres que no sean numeros")
  if(number2 >= 101 || number2 <= 0) return message.channel.send("El numero no puede ser menor a 0 ni mayor a 100")
    const delete_messages2 = await message.channel.messages.fetch({ limit: number2 })
    const delete_messages_con_filtro = await delete_messages2.filter(message => message.author.id.toLowerCase() === target.id.toLowerCase() && !message.pinned)
    const messages_delete = await message.channel.bulkDelete(delete_messages_con_filtro)
    return message.channel.send(`${messages_delete.size} ${messages_delete.size !== 1 ? "mensajes eliminados" : "mensaje eliminado"}`)     
  }
  let number = parseInt(args[1])
  if(!args[1]) number = 100;
  if(isNaN(number)) return message.channel.send("No se permite caracteres que no sean numeros")
  if(number >= 101 || number <= 0) return message.channel.send("El numero no puede ser menor a 0 ni mayor a 100")
    const delete_messages = await message.channel.messages.fetch({ limit: number })
  if(args[0] === options[0]){
    const delete_messages_con_filtro = await delete_messages.filter(message =>  message.author.bot || message.content.startsWith(args[1]) )
    const messages_delete = await message.channel.bulkDelete(delete_messages_con_filtro)
    return message.channel.send(`${messages_delete.size} ${messages_delete.size !== 1 ? "mensajes eliminados" : "mensaje eliminado"}`)     
  } 
  if(args[0] === options[1]){ 
    const delete_messages_con_filtro = await delete_messages.filter(message => message.content.includes(args[1].toLowerCase()))
    const messages_delete = await message.channel.bulkDelete(delete_messages_con_filtro)
    return message.channel.send(`${messages_delete.size} ${messages_delete.size !== 1 ? "mensajes eliminados" : "mensaje eliminado"}`)     
  }
  if(args[0] === options[3]){ 
    const delete_messages_con_filtro = await delete_messages.filter(message => message.embeds.length)
    const messages_delete = await message.channel.bulkDelete(delete_messages_con_filtro)
    return message.channel.send(`${messages_delete.size} ${messages_delete.size !== 1 ? "mensajes eliminados" : "mensaje eliminado"}`)     
  }
  if(args[0] === options[4]){ 
    const delete_messages_con_filtro = await delete_messages.filter(message => message.content.match(/<a?:.+?:\d+>|([\uD800-\uDBFF][\uDC00-\uDFFF])/g))
    const messages_delete = await message.channel.bulkDelete(delete_messages_con_filtro)
    return message.channel.send(`${messages_delete.size} ${messages_delete.size !== 1 ? "mensajes eliminados" : "mensaje eliminado"}`)     
  }
  if(args[0] === options[5]){ 
    const delete_messages_con_filtro = await delete_messages.filter(message => message.attachments.size)
    const messages_delete = await message.channel.bulkDelete(delete_messages_con_filtro)
    return message.channel.send(`${messages_delete.size} ${messages_delete.size !== 1 ? "mensajes eliminados" : "mensaje eliminado"}`)     
  }
  if(args[0] === options[6]){ 
    const delete_messages_con_filtro = await delete_messages.filter(message => message.attachments.size || message.embeds.length)
    const messages_delete = await message.channel.bulkDelete(delete_messages_con_filtro)
    return message.channel.send(`${messages_delete.size} ${messages_delete.size !== 1 ? "mensajes eliminados" : "mensaje eliminado"}`)     
  }
  if(args[0] === options[7]){ 
    const delete_messages_con_filtro = await delete_messages.filter(message => message.content.match(/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/g))
    const messages_delete = await message.channel.bulkDelete(delete_messages_con_filtro)
    return message.channel.send(`${messages_delete.size} ${messages_delete.size !== 1 ? "mensajes eliminados" : "mensaje eliminado"}`)     
  }
  if(args[0] === options[8] || args[0] === "mentions"){ 
    const delete_messages_con_filtro = await delete_messages.filter(message => message.mentions.users.size);
    const messages_delete = await message.channel.bulkDelete(delete_messages_con_filtro)
    return message.channel.send(`${messages_delete.size} ${messages_delete.size !== 1 ? "mensajes eliminados" : "mensaje eliminado"}`)     
  }
  if(args[0] === options[9] || args[0] === "human"){ 
    const delete_messages_con_filtro = await delete_messages.filter(message =>  !message.author.bot)
    const messages_delete = await message.channel.bulkDelete(delete_messages_con_filtro)
    return message.channel.send(`${messages_delete.size} ${messages_delete.size !== 1 ? "mensajes eliminados" : "mensaje eliminado"}`)     
  }
  if(args[0] === options[10]){ 
    const delete_messages_con_filtro = await delete_messages.filter(message =>  message.reactions.cache.size)
    await delete_messages_con_filtro.forEach(async (message) => {
      message.reactions.removeAll() 
      await Discord.Util.delayFor(600)
    });
    let array = [];
    await delete_messages_con_filtro.map(message => array.push(message.reactions.cache.size));
    return await message.channel.send(` ${array.reduce((a, b) => a + b, 0)} reacciones eliminadas`)
  }
    
}
}
 