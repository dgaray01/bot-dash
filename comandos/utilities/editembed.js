import Command from "../../utils/comando.js";
import Discord from "discord.js";
export default class extends Command {
  constructor(options) {
    super(options);
    this.usage = "editembed <msg_ID> <title | description>";
  }
    async run(message, args) {
  if(!args.join(" ")) return message.channel.send("Nesesito el argumento del msg_id");
let msgRes;
for (let a of message.guild.channels.cache.array().filter(a => a.type == 'text')) {
        await Discord.Util.delayFor(100);
let res = await a.messages.fetch(args[0]).catch(a => {});
if(res){
msgRes = res;
break;
}
};
  if(!msgRes) return message.channel.send(`No se encontro ningun mensaje con esa id`)
  if(!msgRes.embeds.length) return message.channel.send("El mensaje no contiene un embed")
  if(this.client.user.id !== msgRes.author.id) return message.channel.send("Solo puedo editar mis mensajes")
  const title_and_description = args.slice(1).join(" ");
  const embed_args_final = title_and_description.split(" | ")
  const embed = new Discord.MessageEmbed(msgRes.embeds[0]);
  if(!embed_args_final) return message.channel.send("Nesesito el argumento del texto")
  embed.setTitle(embed_args_final[0].includes("|") ? args.slice(1).join(" ").split(" | ")[1] : embed_args_final[0])
  if(embed_args_final[1]) embed.setDescription(embed_args_final.slice(1).join(" "))
  await msgRes.edit(embed)    
  await message.channel.send("Mensaje editado")
  }
}