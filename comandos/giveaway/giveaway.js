
import Command from '../../utils/comando.js';
import Discord from 'discord.js';
import ms from "ms";
export default class extends Command {
  constructor(options){
    super(options)
    this.usage = "giveaway <CANAL> <TIEMPO> <GANADOR> <PREMIO>";
  }
  async run(message, args){
    const embed= new Discord.MessageEmbed();
  if(!message.member.hasPermission("MANAGE_CHANNELS")) return message.channel.send("No tienes permisos De gestionar canales");
  let channel = message.mentions.channels.first()
  let id = args[0] ? args[0].match(/(?<=(<#))(\d{17,19})(?=>)/g) : null;
  let canal = id ? this.client.channels.resolve(id[0]) : this.client.channels.resolve(args[0]);
  if(!canal) {
    embed.setAuthor(`Uso adecuado: ${this.usage}`,this.client.errorURL)
    embed.setColor("RED");
    return message.channel.send(embed)
  }
  if(!args[1]) {
    embed.setAuthor(`Uso adecuado: ${this.usage}`,this.client.errorURL)
    embed.setColor("RED");
    return message.channel.send(embed)
  };
  if(!args[1].endsWith("d") && !args[1].endsWith("h") && !args[1].endsWith("m")&& !args[1].endsWith("s")) return message.channel.send(`No Pusiste Un Formato De Tiempo Correcto`)
  if(isNaN(args[1][0])) return message.channel.send(`Eso No es Un Número`);
  if(!args[2]) {
    embed.setAuthor(`Uso adecuado: ${this.usage}`,this.client.errorURL)
    embed.setColor("RED");
    return message.channel.send(embed)
  };
  if(isNaN(args[2])) {
    embed.setAuthor(`El numero de ganadres no deve tener caracteres, solo numeros`,this.client.errorURL)
    embed.setColor("RED");
    return message.channel.send(embed)
  }
  let prize = args.slice(3).join(" ")
        if(!prize) {
          embed.setAuthor(`Uso adecuado: ${this.usage}`,this.client.errorURL)
          embed.setColor("RED");
          return message.channel.send(embed)
        }
  if(typeof ms(args[1]) === "undefined") {
      return message.channel.send("El tiempo no es valido")
    }
        this.client.giveawaysManager.start(channel, {
            time: ms(args[1]),
            prize: prize,
            winnerCount: parseInt(args[2])
        })
}
}
