import Command from "../../utils/comando.js";
import Discord from "discord.js";
import util from 'util';
export default class extends Command {
  constructor(options) {
    super(options);
    this.usage = "embedsource <msg_ID> [channel]";
  }
    async run(message, args) {
  if(!args.join(" ")) return message.channel.send("Nesesito el argumento de id del mensaje")
  const id = args[1] ? args[1].match(/(?<=(<#))(\d{17,19})(?=>)/g) : null;
  let canal = id ? this.client.channels.resolve(id[0]) : this.client.channels.resolve(args[1])
  if(!canal) return message.channel.send("Nesesito que menciones un canal")
  const msg = await canal.messages.fetch(args[0]).catch(a => {})
  if(!msg) return message.channel.send("No es una id valida");
  if(!msg.embeds.length) return message.channel.send("El mensaje no contiene un embed");
  if(this.client.user.id !== msg.author.id) return message.channel.send("Solo puedo editar mis mensajes")
  const embed = new Discord.MessageEmbed(msg.embeds[0]).toJSON();
      const embed_array = Object.keys(embed)
      const embed_sin_null_keys = embed_array.filter(cosa => embed[cosa])
const embed_sin_null =  embed_sin_null_keys.reduce((result, key) => ({...result, [key]: embed[key]}), {})
try{
  const embed1 = new Discord.MessageEmbed()
  .setTitle("Embed source")
  .setDescription(`\`\`\`\n${util.inspect(embed_sin_null)}\n\`\`\``)
  .setColor("#6e83d0");
      
  message.channel.send(embed1)
}catch {
  message.channel.send("El embed es muy largo")
}
  }
}