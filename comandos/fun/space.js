import Command from '../../utils/comando.js';
import Discord from 'discord.js';
import config from '../../config/bot.json';


export default class extends Command {
  constructor(options){
    super(options)
    this.usage = "space [emoji/texto] [texto a ser procesado]";
  }
  async run(message, args){
    
   
    
     
    const error = new Discord.MessageEmbed()
      .setAuthor(
        `Uso adecuado: ${this.usage}`,
        this.client.errorURL
      )
      .setColor("RED");
    let text = args.slice(1)
    let espacios = args[0]
    
    if(!args[0]) return message.channel.send(error)
    if(text === undefined) return message.channel.send(error)
  
    message.channel.send(text.join(espacios));
    
    
  }
}