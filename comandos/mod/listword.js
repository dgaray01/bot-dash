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
    this.usage = "listword";
  }
  async run(message, args) {
  let datos = await db.fetch(`${message.guild.id}.words`)
 const confirmacion = new Discord.MessageEmbed()
 .setAuthor("Lista de palabras prohibidas")
 if(datos) {
    const dataArr = new Set(datos);
    let result = [...dataArr];
    console.log(result)
    await db.set(`${message.guild.id}.words`, result)
    await confirmacion.setDescription(result.slice(0, 25).join("\n"))
 }
  confirmacion.setColor("GREEN")
 message.channel.send(confirmacion)

}
}
