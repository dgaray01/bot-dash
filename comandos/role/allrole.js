import Command from '../../utils/comando.js';
import Discord from 'discord.js';
import config from '../../config/bot.json';


export default class extends Command {
  constructor(options){
    super(options)
    this.usage = "";
  }
 async run(message, args){
       const error = new Discord.MessageEmbed()
      .setAuthor(
        `Uso adecuado: ${this.usage}`,
        this.client.errorURL
      )
      .setColor("RED");

let datasos = message.guild.roles.cache.map(a => `<@&${a.id}> > ${a.id}`).join("\n\n")
const embed = new Discord.MessageEmbed()
.setAuthor("Lista de roles")
.setColor("RANDOM")
.setDescription(datasos)
message.channel.send(embed)
  
  }
}