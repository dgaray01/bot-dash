import Command from "../../utils/comando.js";
import Discord from "discord.js";
export default class extends Command {
  constructor(options) {
    super(options);
    this.usage = "avatar [@member/ID]";
    this.aliases = ["i"];
  }
  async run(message, args) {
    const target = message.mentions.users.first() || this.client.users.resolve(args[0]) || message.author;
    const embed = new Discord.MessageEmbed();
    embed.setTitle(`Avatar de ${target.tag}`);
    embed.addField("Links como", `[png](${target.displayAvatarURL({ format: "png",  size: 1024})}) | [jpg](${target.displayAvatarURL({ format: "jpg" ,  size: 1024 })}) | [webp](${target.displayAvatarURL({ dynamic: true ,  size: 1024 })})`)
    embed.setImage(target.displayAvatarURL({ dynamic: true ,  size: 1024 }))
    embed.setColor("#6e83d0");
    message.channel.send(embed)
  }
}