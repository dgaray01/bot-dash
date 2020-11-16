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
    this.usage = "lvl-opacity <0 a 10>";
  }
  async run(message, args){
    
   
    
        const error = new Discord.MessageEmbed()
      .setAuthor(
        `Uso adecuado: ${this.usage}`,
        this.client.errorURL
      )
      .setColor("RED");
    
    
    if(!args[0]) return message.channel.send(error)
let numero = parseInt(args[0])

if(numero > 10) return message.channel.send(error)
    
let final = numero/10
         let update = `UPDATE userLvl SET opacity = ${final} WHERE id = ${message.author.id}`;

         db.run(update, function(err) {      
          if (err) return console.error(err.message)
          message.channel.send("Opacidad cambiada a " + args.join(""))

         });
 
    
    
  }
} 