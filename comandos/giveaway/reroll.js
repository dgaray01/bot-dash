import Command from '../../utils/comando.js';
import Discord from 'discord.js';
export default class extends Command {
  constructor(options){
    super(options)
    this.usage = "reroll <ID-DEL-SORTEO>";
  }
  async run(message, args){
    const embed = new Discord.MessageEmbed()
      if(!message.member.hasPermission("MANAGE_CHANNELS")) return message.channel.send("No tienes permisos De gestionar canales");
      if(!args[0]){
            embed.setAuthor(`Uso adecuado: ${this.usage}`,this.client.errorURL)
    embed.setColor("RED");
    return message.channel.send(embed)
      }
    this.client.giveawaysManager.reroll(args[0]).then(() => {
            message.channel.send("Success! Giveaway rerolled!");
        }).catch((err) => {
            message.channel.send(`No se encontró ningún Sorteo para ${args[0]} verifique y vuelva a intentarlo`)
        });
  }
}
