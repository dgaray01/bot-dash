import Command from '../../utils/comando.js';
import Discord from 'discord.js';
import config from '../../config/bot.json';
import quick from "quick.db"
const db = new quick.table("reactionroles");
export default class extends Command {
  constructor(options){
    super(options)
    this.usage = "reaction-role <ID del canal> <ID del mensaje>";
  }
 async run(message, args){
       const error = new Discord.MessageEmbed()
      .setAuthor(
        `Uso adecuado: ${this.usage}`,
        this.client.errorURL
      )
      .setColor("RED");

if(!args[0]) return message.channel.send(`Hey, ${message.member}. Debes introducir un canal válido.`);

      const channel = message.mentions.channels.first() || message.guild.channels.resolve(args[0]) || message.guild.channels.cache.find(x => x.name.replace("-", "").includes(args[0].toLowerCase().replace("-", ""))) || null;

      if(!channel) return message.channel.send(`Hey, ${message.member}. Debes introducir un canal válido.`);

      if(!args[1]) return message.channel.send(`Hey, ${message.member}. Debes introducir la ID de un mensaje válido.`);

      channel.messages.fetch(args[1]).then((msg) => {

      if(!msg.id) return message.channel.send(`Hey, ${message.member}. Debes introducir la ID de un mensaje válido.`);

      const filter = m => m.author.id == message.author.id;

      const collector = message.channel.createMessageCollector(filter);

      message.channel.send(`Hola, ${message.member}. Para comenzar, escribe los datos en el siguiente formato:\n**Uso**:\n@Role, :emoji:\n**Ejemplo**:\n${message.guild.me.roles.cache.find(x => x.managed) ? message.guild.me.roles.cache.find(x => x.managed).toString() : message.member.roles.highest.toString()}, :+1:\n\nCuando termines, escribe **.done**. Si quieres cancelarlo, puedes escribir **.cancel**`)

      collector.on("collect", (m) => {

        const arg = m.content.split(" ");

        if(m.content.toLowerCase().startsWith(".done")){

          return collector.stop("done")

        }

        if(m.content.toLowerCase().startsWith(".cancel")){

          collector.stop("cancel");
          return message.channel.send(`Hey, ${message.member}. Has cancelado la selección de roles por reacción.`);

        }

        const possibleValues = arg.join(" ").replace(" ", "").split(",");

        const possibleRole = possibleValues[0].replace(" ", "");
        const possibleEmoji = possibleValues[1];
        console.log(possibleValues)

        let role = message.guild.roles.cache.find(x => possibleRole.includes(x.id)) || message.guild.roles.resolve(possibleRole) || message.guild.roles.cache.find(x => x.name.toLowerCase().replace(" ", "") == possibleRole.toLowerCase());
      
        if(!role) return m.react("❌");

        if(role.managed || role.comparePositionTo(message.guild.me.roles.highest) >= 0) return m.react("⚠"), message.channel.send(`No tengo permisos para dar este role, ${message.author}`)

        let emoji = this.client.emojis.cache.find(x => x.id == possibleEmoji || x.toString() == possibleEmoji);
      
        const emoji2 = Discord.Util.parseEmoji(possibleEmoji)

        if(!emoji2.id && possibleEmoji.match(/([\uD800-\uDBFF][\uDC00-\uDFFF])/g)) emoji = emoji2;

        if(!emoji) return m.react("❌");

        if(db.get(`${msg.id}`) && db.get(`${msg.id}`).find((a) => a.emoji == `${emoji.id ? emoji.id : emoji.name}`)) return m.react("⚠"), message.channel.send(`Hey, ${message.member}. Ya has seleccionado este emoji.`);

        db.push(`${msg.id}`, { emoji: `${emoji.id ? emoji.id : emoji.name}`, role: role.id });

    	return m.react("✅");
  
      })

      collector.on("end", (m, r) => {

      if(r == "cancel"){

      	db.delete(`${msg.id}`);

      } else if(r == "done"){

      	const size = db.get(`${msg.id}`) && db.get(`${msg.id}`).length ? message.channel.send(`Hey, ${message.member}. Has establecido ${db.get(`${msg.id}`).length} role${db.get(`${msg.id}`).length != 1 ? "s" : ""}.`) : message.channel.send(`Hey, ${message.member}. No has establecido ningún rol.`);

        db.get(`${msg.id}`).forEach((data) => {
          console.log(data.emoji)
          msg.react(data.emoji);
        })

      }

      })

    }).catch((err) => {

      return message.channel.send(`${message.member}, debes introducir una ID válida para el mensaje.`);

    })

  }
  
  }
