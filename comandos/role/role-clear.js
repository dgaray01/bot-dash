import Command from "../../utils/comando.js";
import Discord from "discord.js";
import config from "../../config/bot.json";

export default class extends Command {
  constructor(options) {
    super(options);
    this.usage = "";
  }
  async run(message, args) {
    const error = new Discord.MessageEmbed()
      .setAuthor(`Uso adecuado: ${this.usage}`, this.client.errorURL)
      .setColor("RED");

    let user =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]);

    let owner = message.guild.owner.user.id;

    if (message.author == owner) {
      if (!args[0])
        return message.channel.send("Debes mencionar a un usuario.");
      if (!user)
        return message.channel.send("Debes mencionar a un usuario válido.");

      await user.roles.set([]);
      return message.channel.send(
        `Se han eliminado los roles al usuario ${user}`
      );
    }

    if (!message.member.hasPermission("MANAGE_ROLES", "ADMINISTRADOR"))
      return message.channel.send(
        "No tienes permisos para utilizar este comando"
      );
    if (!message.guild.me.hasPermission("MANAGE_ROLES", "ADMINISTRADOR"))
      return message.channel.send("El bot necesita permiso de gestionar roles");

    if (!args[0]) return message.channel.send("Debes mencionar a un usuario.");
    if (!user)
      return message.channel.send("Debes mencionar a un usuario válido.");
    if (user == owner)
      return message.channel.send("No puedes remover roles a ese usuario");
    if (user == message.author.id) {
      await user.roles.set([]);
    }

    await user.roles.set([]);
    return message.channel.send(
      `Se han eliminado correctamente los roles del usuario **${user.displayName}** | Removido por por: **${message.member.displayName}**`
    );
  }
}
