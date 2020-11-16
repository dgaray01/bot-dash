import Discord from "discord.js";
import Command from "../../utils/comando.js";
import quick from "quick.db";
export default class extends Command {
  constructor(options) {
    super(options);
    this.usage = "[autorole|autoroles]";
    this.aliases = ["autorole"];
  }
  async run(message, args) {
    const db = new quick.table("autorole");
    const roles = db.fetch(message.guild.id);
    const embed = new Discord.MessageEmbed();
    if (!message.member.hasPermission("MANAGE_GUILD")) return;
    if (!message.guild.me.hasPermission("MANAGE_GUILD"))
      return message.channel.send("Nesesito permisos de gestionar servidor");
    if (!args.join(" ")) {
      embed.setTitle("Roles autoasignables");
      embed.addField(
        "¿Reasigna roles?",
        roles ? (roles.activate ? "✅" : "❌") : "❌",
        true
      );
      if (roles && roles.roles && roles.roles.length) {
        embed.setDescription(
          roles.roles.map(a => message.guild.roles.resolve(a))
        );
      }
      embed.addField(
        "¿Quiere agregar más?",
        `Puede agregar más autoroles con \`${message.content +
          " add <role>"}\` o en el dashboard`,
        true
      );
      embed.setColor("#6e83d0");
      message.channel.send(embed);
    } else if (args[0] === "readd" || args[0] === "reassign") {
      if (roles && roles.activate) {
        await db.set(`${message.guild.id}.activate`, false);
        await message.channel.send(`Autoroles desactivados`);
      } else {
        await db.set(`${message.guild.id}.activate`, true);
        await message.channel.send(`Autoroles activado`);
      }
    } else if (args[0] === "add") {
      const role = message.mentions.roles.first();
      if (!role) return message.channel.send("Nesesita mencionar un rol");
      if (role.position >= message.member.roles.highest.position)
        return message.channel.send(
          "El rol que intenta poner es de la misma o mayor jerarquia que su rol mas alto"
        );
      if (!role.managed)
        return message.channel.send("No puede gestionar ese rol");
      if (!roles) {
        await db.push(`${message.guild.id}.roles`, role.id);
      } else {
        const roles_sin_repetir = roles.roles.filter(
          (value, index, self) =>
            self.indexOf(value) === index && message.guild.roles.resolve(value)
        );
        await db.set(`${message.guild.id}.roles`, roles_sin_repetir);
      }
      embed.setTitle("Autorole añadido");
      embed.setDescription(
        `${role} ahora se asignara al unirse un miembro al servidor`
      );
      embed.setColor("GREEN");
      message.channel.send(embed);
    } else if (args[0] === "remove") {
      const role = message.mentions.roles.first();
      if (!role) return message.channel.send("Nesesita mencionar un rol");
      if (role.position >= message.member.roles.highest.position)
        return message.channel.send(
          "El rol que intenta quitar es de la misma o mayor jerarquia que su rol mas alto"
        );
      if (!roles.roles.includes(role.id))
        return message.channel.send(
          `El rol ${role} no estaba añadido anteriormente`
        );
      if (role.managed)
        return message.channel.send("No puede gestionar ese rol");
      const los_roles = roles.roles;
      delete los_roles[los_roles.indexOf(role.id)];
      await db.set(`${message.guild.id}.roles`, los_roles);
      embed.setTitle("Autorole añadido");
      embed.setDescription(
        `${role} ahora no se asignara al unirse un miembro al servidor`
      );
      embed.setColor("RED");
      message.channel.send(embed);
    } else if (args[0] === "bl" || args[0] === "blacklist") {
      const roles_mencionados = message.mentions.roles.array().map(a => a.id);
      if (!roles_mencionados.length)
        return message.channel.send("Nesesita mencionar roles");
      if (
        message.mentions.roles.some(
          a =>
            message.guild.roles.resolve(a).position >=
            message.member.roles.highest.position
        )
      ) {
        return message.channel.send(
          `El rol ${
            message.mentions.roles.find(
              a =>
                message.guild.roles.resolve(a).position >=
                message.member.roles.highest.position
            ).name
          } es de mayor o igual jerarquia que la de usted, pidele a un mod que ejecute este comando`
        );
      }
      if (
        message.mentions.roles.some(a => message.guild.roles.resolve(a).managed)
      )
        return message.channel.send(
          `El rol ${
            message.mentions.roles.find(
              a => message.guild.roles.resolve(a).managed
            ).name
          } no se puede gestionar`
        );
      let roles_reduce = (roles && roles.blacklist) || [];
      for (let i = 0; i < roles_mencionados.length; i++) {
        roles_reduce.push(roles_mencionados[i]);
      }
      const roles_sin_repetir = roles_reduce.filter(
        (value, index, self) => self.indexOf(value) === index
      );
      await db.set(`${message.guild.id}.blacklist`, roles_sin_repetir);
      embed.setTitle("Autoroles en BlackList");
      embed.setDescription(
        `añadido ${message.mentions.roles.map(a => a).join(" ")} a la blacklist`
      );
      embed.setColor("GREEN");
      message.channel.send(embed);
    } else if (args[0] === "unblacklist") {
      const roles_mencionados = message.mentions.roles.array().map(a => a.id);
      if (!roles_mencionados.length)
        return message.channel.send("Nesesita mencionar roles");
      if (
        message.mentions.roles.some(
          a =>
            message.guild.roles.resolve(a).position >=
            message.member.roles.highest.position
        )
      ) {
        return message.channel.send(
          `El rol ${
            message.mentions.roles.find(
              a =>
                message.guild.roles.resolve(a).position >=
                message.member.roles.highest.position
            ).name
          } es de mayor o igual jerarquia que la de usted, pidele a un mod que ejecute este comando`
        );
      }
      let roles_reduce = roles && roles.blacklist;
      await db.set(
        `${message.guild.id}.blacklist`,
        roles_reduce.filter(a => !roles_mencionados.includes(a))
      );
      embed.setTitle("Autoroles en BlackList");
      embed.setDescription(
        `quitado ${message.mentions.roles
          .map(a => a)
          .join(" ")} de la blacklist`
      );
      embed.setColor("RED");
      message.channel.send(embed);
    }
  }
}
