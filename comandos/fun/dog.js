import Command from '../../utils/comando.js';
import Discord from 'discord.js';
import config from '../../config/bot.json';
import animals from "relevant-animals"

export default class extends Command {
  constructor(options){
    super(options)
    this.usage = "";
  }
  async run(message, args){
    
       animals.shibe().then(s =>{
      

   const embed = new Discord.MessageEmbed()
   .setAuthor(`${message.author.username} | Dog`, message.author.avatarURL())
   .setColor("RANDOM")
   .setImage(s)
   message.reply(embed)
    
 
    })   
    
 
    
    
  }
}