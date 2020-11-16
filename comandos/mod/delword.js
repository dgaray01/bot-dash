import Command from '../../utils/comando.js';
import Discord from 'discord.js';
import config from '../../config/bot.json';
import util from 'util';
import ms from "ms";
import quick from "quick.db"
 const db = new quick.table("words_malas");
export default class extends Command {
  constructor(options){
    super(options)
    this.usage = "delword <palabra>";
  }
  async run(message, args) {

  if(!message.member.hasPermission('ADMINISTRATOR')){
    const embed = new Discord.MessageEmbed()
    embed.setAuthor(`Nesesitas permisos para poder usar este comando`,this.client.errorURL)
    embed.setColor("RED");
    return message.channel.send(embed)
  }
  if(!args.length) return;
    const datos = db.get(`${message.guild.id}.words`)
    if(!datos) return;
    db.set(`${message.guild.id}.words`, datos.filter((item, index) => datos.indexOf(item) === index))
    const confirmacion = new Discord.MessageEmbed()
     .setAuthor("Se ha eliminado " + args[0] + " de la lista de palabras prohibidas")
     .setColor("GREEN")
     message.channel.send(confirmacion)
}
}
