import Command from "../../utils/comando.js";
import Discord from "discord.js";
export default class extends Command {
  constructor(options) {
    super(options);
    this.usage = "[i|info] [@member/ID]";
    this.aliases = ["i"];
  }
  async run(message, args) {
    const target = message.mentions.members.first() || message.guild.members.resolve(args[0]) ||message.member;
    const trimArray = function (array, maxLen = 5) {
    if (array.length > maxLen) {
      const len = array.length - maxLen;
      array = array.slice(0, maxLen);
      array.push(`${len} roles más`);
    }
    return array;
    }
    const embed = new Discord.MessageEmbed();
    const roles = target.roles.cache
        .sort((a, b) => b.position - a.position)
        .map(role => role)
        .slice(0, -1);
    embed.setAuthor(target.user.tag, target.user.displayAvatarURL({ dynamic: true}));
    embed.setDescription(`[Avatar](${target.user.displayAvatarURL({ dynamic: true})})`);
    embed.addField("Roles", roles.length ? (roles.length < 5 ? roles.join(' ') : trimArray(roles).join(" ")) : 'No tiene Roles', true);
    embed.addField("Created at", target.user.createdAt.toUTCString(), true)
    embed.addField("Joined at", target.joinedAt.toUTCString(), true);
    embed.setFooter(`ID: ${target.id}`)
    embed.setColor(target.displayHexColor || "BLACK")
    message.channel.send(embed)
  }
}