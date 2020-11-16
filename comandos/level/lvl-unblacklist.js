import Command from '../../utils/comando.js';
import Discord from 'discord.js';
import config from '../../config/bot.json';
import util from 'util';
import quick from 'quick.db'
const db = new quick.table("levelblacklist");

export default class extends Command {
  constructor(options){
    super(options)
    this.usage = "lvl-unblacklist <@user/#canal/>";
  }
  async run(message, args){
    
    
        const error = new Discord.MessageEmbed()
      .setAuthor(
        `Uso adecuado: ${this.usage}`,
        this.client.errorURL
      )
      .setColor("RED");
    
    let mencion = message.mentions.channels.first() || message.mentions.users.first();
if(!mencion) return message.channel.send(error)
          
    
    let fetched = db.fetch(`blacklist_${mencion.id}`)
    
        if(!fetched) {
          return message.channel.send(`Nunca estuvo en blacklist`);
      db.delete(`blacklist_${mencion.id}`)
      message.channel.send(`Ha sido removido de la blacklist correctamente, ya podra obtener XP`);
    }else{ 
            db.delete(`blacklist_${mencion.id}`)
      message.channel.send(`Ha sido removido de la blacklist correctamente, ya podra obtener XP`);
    }   
  }
} 