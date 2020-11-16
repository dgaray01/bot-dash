import Command from '../../utils/comando.js';
import Discord from 'discord.js';
import config from '../../config/bot.json';
import util from 'util';
import cat from 'random-cat'
export default class extends Command {
  constructor(options){
    super(options)
    this.usage = "cat";
  }
  async run(message, args){
    
   
      const embed = new Discord.MessageEmbed()
      .setAuthor(`${message.author.username} | Cat`, message.author.avatarURL())
      .setColor("RANDOM")
      .setImage(cat.get())
    message.channel.send(embed)
    
  }
} 