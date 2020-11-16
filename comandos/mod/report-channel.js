import Command from "../../utils/comando.js";
import Discord from "discord.js";
import quick from "quick.db";
const db = new quick.table("report_echannel");

export default class extends Command {
  constructor(options) {
    super(options);
    this.usage = "report-channel <#canal/ID>";
  }
  async run(message, args) {
    const embed = new Discord.MessageEmbed();

    const channel =
      message.mentions.channels.first() ||
      message.guild.channel.cache.get(args[0]);
    if (!message.guild.me.hasPermission("MANAGE_CHANNELS")) {
      embed.setAuthor(
        `No puedo establecer un rol por falta de permiso de gestionar canales`,
        this.client.errorURL
      );
      embed.setColor("RED");
      return message.channel.send(embed);
    }
    if (!message.member.hasPermission("MANAGE_CHANNELS")) {
      embed.setAuthor(
        `Nesesitas permisos para poder usar este comando`,
        this.client.errorURL
      );
      embed.setColor("RED");
      return message.channel.send(embed);
    }
    if (!channel) {
      embed.setAuthor(`Uso adecuado: ${this.usage}`, this.client.errorURL);
      embed.setColor("RED");
      return message.channel.send(embed);
    }
    db.set(`reportChannel_${message.guild.id}`, channel.id);
    message.channel.send(`Canal de reportes establecido: **${channel}**`);
  }
}
