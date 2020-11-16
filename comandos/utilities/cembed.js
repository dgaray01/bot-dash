import Command from "../../utils/comando.js";
import Discord from "discord.js";
export default class extends Command {
  constructor(options) {
    super(options);
    this.usage = "cembed [channel] <JSON>";
  }
    async run(message, args) {
  if(!args.join(" ")) return message.channel.send("Nesesito el argumento del canal");
        const id = args[0] ? args[0].match(/(?<=(<#))(\d{17,19})(?=>)/g) : null;
  let canal = id ? this.client.channels.resolve(id[0]) : this.client.channels.resolve(args[0])
  if(!canal) return message.channel.send("No menciono ningun canal");
  const embed_args = args.slice(1).join(" ");
      try {
      canal.send({embed: JSON.parse(embed_args)})
      } catch (a) {
message.channel.send(`Hubo un error ${a}`)
      }
  }
}