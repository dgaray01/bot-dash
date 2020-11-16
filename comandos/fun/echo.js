import Command from '../../utils/comando.js';
import Discord from 'discord.js';
import config from '../../config/bot.json';


export default class extends Command {
  constructor(options){
    super(options)
    this.usage = "echo <#canal> [texto]";
  }
  async run(message, args){
    
   let canal = message.mentions.channels.first()
    let texto = args.join("")
    
  
    
    
    
        const error = new Discord.MessageEmbed()
    .setAuthor(`Uos adecuado: ${this.usage}`, this.client.errorURL)
    .setColor("RED")
    
    if(!texto) return message.channel.send(error)
    
   message.react("✅")
    
    if(!canal) return message.channel.send(texto)
    

    canal.send(args.slice(1).join(' '))
    
    
  }
}