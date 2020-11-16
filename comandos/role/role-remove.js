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
    let role =
      message.mentions.roles.first() ||
      message.guild.roles.cache.find(r => r.id == args[1]);

    let owner = message.guild.owner.user.id;

    if (message.author == owner) {
      if (!args[0])
        return message.channel.send("Debes mencionar a un usuario.");
      if (!user)
        return message.channel.send("Debes mencionar a un usuario válido.");

      if (!args[1]) return message.channel.send("Debes mencionar un rol.");
      if (!role) return message.channel.send("Debes mencionar un rol válido.");

      if (!role.editable)
        return message.channel.send("Rol mas alto que el mio");
      if (!user.roles.cache.has(role.id))
        return message.channel.send("Ese usuario no cuenta con ese rol");

      await user.roles.remove(role.id);
      return message.channel.send(
        `El rol ${role.name} ha sido removido correctamente del usuario ${user}`
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
      if (!args[1]) return message.channel.send("Debes mencionar un rol.");
      if (!role) return message.channel.send("Debes mencionar un rol válido");
      if (role.comparePositionTo(message.member.roles.highest) >= 0)
        return message.channel.send(
          "No puedes remover un rol igual o superior al tuyo."
        );

      if (!role.editable)
        return message.channel.send("Rol mas alto que el mio");
      if (!user.roles.cache.has(role.id))
        return message.channel.send("No cuentas con ese rol");

      await user.roles.add(role.id);
      return message.channel.send(`**${user}** se ha removido el rol ${role}`);
    }

    if (!args[1]) return message.channel.send("Debes mencionar un rol.");
    if (!role) return message.channel.send("Debes mencionar un rol válido");
    if (role.comparePositionTo(message.member.roles.highest) >= 0)
      return message.channel.send(
        "No puedes remover un rol igual o superior al tuyo."
      );

    if (!role.editable) return message.channel.send("Rol mas alto que el mio");
    if (!user.roles.cache.has(role.id))
      return message.channel.send("Ese usuario no cuenta con ese rol");

    await user.roles.remove(role.id);
    return message.channel.send(
      `El rol **${role.name}** ha sido removido correctamente al usuario **${user.displayName}** | Removido por: **${message.member.displayName}**`
    );
  }
}
