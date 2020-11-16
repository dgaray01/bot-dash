import Command from '../../utils/comando.js';
import Discord from 'discord.js';
import config from '../../config/bot.json';
import quick from 'quick.db'
const db = new quick.table("moderation");

export default class extends Command {
  constructor(options){
    super(options)
    this.usage = "disable-mod";
    this.userPerms = [8, 0];
  }
  async run(message, args){
    
   const status = db.fetch(`mod_status_${message.guild.id}`)
   
   if(!status){
     
     db.set(`mod_status_${message.guild.id}`, true)
     message.reply("Comandos de moderador han sido desactivados")
   } else{
     
     message.reply("Los comandos de moderador ya han sido desactivados")
     
   }
    
 
    
    
  }
}