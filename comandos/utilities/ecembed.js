import Command from "../../utils/comando.js";
import Discord from "discord.js";
import fetch from "node-fetch";

export default class extends Command {
  constructor(options) {
    super(options);
    this.usage = "ecembed <msg_ID> <channel> <JSON/Pastebin_Link/Starb.in_Link>";
  }
    async run(message, args) {
  if(!args.join(" ")) return message.channel.send("Nesesito el argumento de la id del mensaje");
  const id = args[1] ? args[1].match(/(?<=(<#))(\d{17,19})(?=>)/g) : null;
  let canal = id ? this.client.channels.resolve(id[0]) : this.client.channels.resolve(args[1]);
  if(!canal) return message.channel.send("No menciono ningun canal");
  const msg = await canal.messages.fetch(args[0]).catch(a => {})
  if(!msg) return message.channel.send("No es una id valida");
  if(!msg.embeds.length) return message.channel.send("El mensaje no contiene un embed");
  if(this.client.user.id !== msg.author.id) return message.channel.send("Solo puedo editar mis mensajes")
  const embed_args = args.slice(1).join(" ");
      try {
      msg.edit({embed: JSON.parse(embed_args)})
      } catch {
        try {
        if(embed_args.startsWith("https://pastebin.com/")) {
const url = embed_args.replace(`https://pastebin.com/`, "");
const request = await fetch(`https://pastebin.com/raw.php?i=${url}`);
if(request.status === 404) return message.channel.send("No existe un codigo con esa url");
      msg.edit({embed: JSON.parse(await request.text())})
        } else if (embed_args.startsWith("http://pastebin.com/")) {
          const url = embed_args.replace(`http://pastebin.com/`, "");
const request = await fetch(`https://pastebin.com/raw.php?i=${url}`);
if(request.status === 404) return message.channel.send("No existe un codigo con esa url");
      msg.edit({embed: JSON.parse(await request.text())})
        } else if(embed_args.startsWith("https://hastebin.com/")) {
          const url = embed_args.replace(`https://hastebin.com/"`, "");
const request = await fetch(`https://hastebin.com/raw/?i=${url}`);
if(request.status === 404) return message.channel.send("No existe un codigo con esa url");
      msg.edit({embed: JSON.parse(await request.text())})
        }
          else if(embed_args.startsWith("http://hastebin.com/")) {
          const url = embed_args.replace(`http://hastebin.com/"`, "");
const request = await fetch(`https://hastebin.com/raw/?i=${url}`);
if(request.status === 404) return message.channel.send("No existe un codigo con esa url");
      msg.edit({embed: JSON.parse(await request.text())})
        } else {
          return message.channel.send("No puse una url o un json valido")
        }
          } catch (a) {
message.channel.send(`Hubo un error ${a}`)
          }
      }
  }
}
