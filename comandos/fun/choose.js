import Command from '../../utils/comando.js';
import Discord from 'discord.js';
import config from '../../config/bot.json';


export default class extends Command {
  constructor(options){
    super(options)
    this.usage = "choose <dato 1> | <dato 2> | (dato 3)";
  }
  async run(message, args){
    
    let opciones = args.join(" ")
    let text = opciones.split(" | ")
   let option1 = text[0]
       let option2 = text[1]

    const error = new Discord.MessageEmbed()
      .setAuthor(
        `Uso adecuado: ${this.usage}`,
        this.client.errorURL
      )
      .setColor("RED");
        const error2 = new Discord.MessageEmbed()
      .setAuthor(
        `Uso adecuado: ${this.usage}`,
        this.client.errorURL
      )
      .setColor("RED")
        .setFooter("Separa los argumentos por ``|``")//ke pasa
    if(!args.join(" ")) return message.channel.send(error); //Returns aca
if(!option1 || !option2) return message.channel.send(error2) //Returns aca
    let ready = text[Math.floor(Math.random() * text.length)]
  const embed = new Discord.MessageEmbed()
      .setAuthor(`${message.author.username} | Choose`, message.author.avatarURL())
      .setColor("RANDOM")
  .addField("Dato elegido:", ready) //Error aca que no hay nada en el field
  message.channel.send(embed)

    
    
  }
}