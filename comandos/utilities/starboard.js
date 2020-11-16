import Command from "../../utils/comando.js";
import Discord from "discord.js";
import quick from "quick.db";
const db = new quick.table("starboard_role");
export default class extends Command {
  constructor(options) {
    super(options);
    this.usage = "starboard <CANAL/opcional>";
  }
  async run(message, args) {
    const embed = new Discord.MessageEmbed();
    if (!message.guild.me.hasPermission("MANAGE_CHANNELS")) {
      embed.setAuthor(`No puedo establecer un rol por falta de permiso de gestionar canales`,this.client.errorURL);
      embed.setColor("RED");
      return message.channel.send(embed);
    }
    if (!message.member.hasPermission("MANAGE_CHANNELS")) {
      embed.setAuthor(`Nesesitas permisos para poder usar este comando`,this.client.errorURL);
      embed.setColor("RED");
      return message.channel.send(embed);
    }
    let channel =
      message.mentions.channels.first() ||
      message.guild.channels.resolve(args[0])
      const starboard_channel = await db.fetch(message.guild.id)
      const canalsito = this.client.channels.resolve(starboard_channel && starboard_channel.channel)
    if(!channel) {
      if(!canalsito) {
       channel = await message.guild.channels.create("starboard");
      db.set(`${message.guild.id}.channel`, channel.id);
      message.channel.send(`🌟 Starboard creado en ${channel} Por defecto, los mensajes requieren 2 estrellas para aparecer`);
      } else {
      message.channel.send(`Ya hay un canal establecido ${canalsito}`)
    }
    }
}
}
