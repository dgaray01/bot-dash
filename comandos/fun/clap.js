import Command from '../../utils/comando.js';
import Discord from 'discord.js';
import config from '../../config/bot.json';


export default class extends Command {
  constructor(options){
    super(options)
    this.usage = "clap [texto]";
  }
  async run(message, args){
    
   
    
     let text = args.join("👏")
    const error = new Discord.MessageEmbed()
      .setAuthor(
        `Uso adecuado: ${this.usage}`,
        this.client.errorURL
      )
      .setColor("RED");
    if (!text) return message.channel.send(error);
    message.channel.send(text);
    
    
  }
}