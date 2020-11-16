import Command from "../../utils/comando.js";
import Discord from "discord.js";
export default class extends Command {
  constructor(options) {
    super(options);
    this.usage = "embed [channel] <color> <title | description>";
  }
    async run(message, args) {
  const id = args[0] ? args[0].match(/(?<=(<#))(\d{17,19})(?=>)/g) : null;
  let canal = id ? this.client.channels.resolve(id[0]) : this.client.channels.resolve(args[0])
  if(!args.join(" ")) return message.channel.send("Nesesito el argumento del color")
  let embed_args = args;
  if(canal) embed_args = args.slice(1)
      else canal = message.channel;
  const validation_hexadeximal_color = new RegExp("^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$");
  if(!validation_hexadeximal_color.test(embed_args[0])) return message.channel.send(`"${embed_args[0]}" no es un color válido. Ingrese un color en el hexadecimal \`#ffffff\`.`)
      const title_and_description = embed_args.slice(1).join(" ");
  const embed_args_final = title_and_description.split(" | ")
  const embed = new Discord.MessageEmbed();
  if(!embed_args_final) return message.channel.send("Nesesito el argumento del texto")
  embed.setColor(embed_args[0])
  embed.setTitle(embed_args_final[0].includes("|") ? embed_args.slice(1).join(" ").split(" | ")[1] : embed_args_final[0])
  if(embed_args_final[1]) embed.setDescription(embed_args_final.slice(1).join(" "))
  canal.send(embed)   
  }
}