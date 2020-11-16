import Command from '../../utils/comando.js';
import Discord from 'discord.js';
import config from '../../config/bot.json';
import util from 'util';
import quick from 'quick.db'
const db = new quick.table("levelblacklist");

export default class extends Command {
  constructor(options){
    super(options)
    this.usage = "lvl-blacklist <@user/#canal>";
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
      db.set(`blacklist_${mencion.id}`, true)
      message.channel.send(`Ha sido agregado a la blacklist correctamente, ya no podra obtener XP`);
    }else{ 
      return message.channel.send(`Ya fue agregado`);
    }
 
       

    
    
    
    
  }
} 