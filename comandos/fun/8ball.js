import Command from '../../utils/comando.js';
import Discord from 'discord.js';
import config from '../../config/bot.json';


export default class extends Command {
  constructor(options){
    super(options)
    this.usage = "8ball [pregunta]";
  }
  async run(message, args){
    
    
    const error = new Discord.MessageEmbed()
    .setAuthor(`Uos adecuado: ${this.usage}`, this.client.errorURL)
    .setColor("RED")
    
 let pregunta = args.join(" ")
 if(!pregunta) return message.channel.send(error)
      let respuesta = ["Si", "No", "Tal vez", "Obvio", "Yo digo que si", "Yo digo que no", "Probablemente", "No estoy seguro", "Hmmm, no lo se", "Hmm Tal vez"]
  var random = respuesta[Math.floor(Math.random() * respuesta.length)]
 
    
  const embed = new Discord.MessageEmbed()
  .setAuthor(`${message.author.username} | 8ball `, message.author.avatarURL())
  .setColor("GREEN")
  .addField("Pregunta:", `\`\`\`js\n${pregunta}\n\`\`\``)
  .addField("Respuesta:", `\`\`\`js\n${random}\n\`\`\``)
  message.channel.send(embed)
  
  }
}