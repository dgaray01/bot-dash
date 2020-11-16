import Command from '../../utils/comando.js';
import Discord from 'discord.js';
import config from '../../config/bot.json';
import util from 'util';
import db from "quick.db";

export default class extends Command {
  constructor(options){
    super(options)
    this.usage = "log-ignore <#CANAL>";
  }
  async run(message, args){
       const error = new Discord.MessageEmbed()
      .setAuthor(
        `Uso adecuado: ${this.usage}`,
        this.client.errorURL
      )
      .setColor("RED");
    const error2 = new Discord.MessageEmbed()
  .setAuthor(
    `El canal no es un canal de texto`,
    this.client.errorURL
  )
  .setColor("RED");
 const canal = message.mentions.channels.first();
if(!canal) return message.channel.send(error);
if (canal.type !== "text") return message.channel.send(error2);
db.set(`logs_${message.guild.id}`, canal.id);
await message.channel.send("Canal establecido correctamente");
    
  }
} 