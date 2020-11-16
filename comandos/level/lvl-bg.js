import Command from '../../utils/comando.js';
import Discord from 'discord.js';
import config from '../../config/bot.json';
import util from 'util';
import sqlite3 from 'sqlite3'
sqlite3.verbose()
const db = new sqlite3.Database("./db/niveles.sqlite");
export default class extends Command {
  constructor(options){
    super(options)
    this.usage = "lvl-bg <URL con imagen que termine con png, jpg, gif>";
  }
  async run(message, args){
    
    
        const error = new Discord.MessageEmbed()
      .setAuthor(
        `Uso adecuado: ${this.usage}`,
        this.client.errorURL
      )
      .setColor("RED");
    if(!args[0]) return message.channel.send(error)
  if(!args.join("").match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/g)) return message.channel.send(error)
  
         let update = `UPDATE userLvl SET bg = '${args.join("")}' WHERE id = ${message.author.id}`;

         db.run(update, function(err) {      
          if (err) return console.error(err.message)
          message.channel.send("Imagen de background cambiado a " + args.join(""))

         });
    
    
  }
} 