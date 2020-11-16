import Command from '../../utils/comando.js';
import Discord from 'discord.js';
import quick from "quick.db";
const db = new quick.table("report_echannel");

export default class extends Command {
  constructor(options){
    super(options)
    this.usage = "report <texto>";
  }
  async run(message, args, client){

    let texto = args.join(" ")
    let canalID = db.fetch(`reportChannel_${message.guild.id}`)
let canal = this.client.channels.cache.get(canalID)    

if(!canal) return message.reply("Dile a un administrador que agregue el sistema de reportes `"+ this.client.commands.get("report-channel").usage + "`")

    const embed = new Discord.MessageEmbed();
    
  if(!texto) {
    embed.setAuthor(`Uso adecuado: ${this.usage}`,this.client.errorURL)
    embed.setColor("RED");
    return message.channel.send(embed)
  }

    embed.setAuthor("Reporte enviado")
    .setColor("GREEN")
    message.channel.send(embed)
  
  const embed2 = new Discord.MessageEmbed()
  .setColor("RED")
  .addField("Usuario reportando:", message.author)
  .addField("Razon:", texto)
  canal.send(embed2)
}
}