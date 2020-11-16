import Command from "../../utils/comando.js";
import Discord from "discord.js";
export default class extends Command {
  constructor(options) {
    super(options);
    this.usage = "rr color [channel] <msg_ID> <color>";
  }
    async run(message, args) {
  if(!args.length) return;
  if(args[0] !== "color") return ;
  const id = args[1] ? args[1].match(/(?<=(<#))(\d{17,19})(?=>)/g) : null;
  let canal = id ? this.client.channels.resolve(id[0]) : this.client.channels.resolve(args[1]);
  if(!canal) return message.channel.send("No menciono ningun canal");
  const msg = await canal.messages.fetch(args[2]).catch(a => {})
  if(!msg) return message.channel.send("No es una id valida");
  if(!msg.embeds.length) return message.channel.send("El mensaje no contiene un embed");
  if(this.client.user.id !== msg.author.id) return message.channel.send("Solo puedo editar mis mensajes")
  if(!args[3]) return message.channel.send("nesito argumento de color")
  const validation_hexadeximal_color = new RegExp("^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$");
  if(!validation_hexadeximal_color.test(args[3])) return message.channel.send(`"${args[3]}" no es un color válido. Ingrese un color en el hexadecimal \`#ffffff\`.`)
  const embed = new Discord.MessageEmbed(msg.embeds[0])
  embed.setColor(args[3])
  msg.edit(embed)
  }
}