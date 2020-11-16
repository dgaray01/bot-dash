import Command from "../../utils/comando.js";
import Discord from "discord.js";
import quick from 'quick.db'
const db = new quick.table("prefix");
import config from '../../config/bot.json';
export default class extends Command {
  constructor(options) {
    super(options);
    this.usage = "serverinfo";
    this.aliases = ["i"];
  };
  async run(message, args) {
    const guild = message.guild
    const defaultPrefix = config.prefix;
    const embed = new Discord.MessageEmbed();
    let prefixes = await db.fetch(message.guild.id);
    const prefix_array  = prefixes ? prefixes : [defaultPrefix]
    embed.setTitle(`Informacion de ${guild.name}`);
    embed.addField("Owner", guild.owner.user.tag, true)
    embed.addField("** **", "** **", true)
    const channels = guild.channels.cache
    embed.addField("Channels", 
    `${channels.filter(a => a.type === "text").size ? `${channels.filter(a => a.type === "text").size} Texto` : ""}
    ${channels.filter(a => a.type === "voice").size ? `${channels.filter(a => a.type === "voice").size} voz` : ""}`
    , true)
    embed.addField("Info", `
    ${guild.explicitContentFilter}
    Verification level: ${guild.verificationLevel}
    Voice region: ${guild.region}
    [link icono](${guild.iconURL({dynamic: true, size: 1024})})
    `, true)
    embed.addField("Prefixes", prefix_array.join("\n"), true);
    const members = guild.members.cache
    embed.addField("Members", `Total: ${members.size}\nHumans: ${members.filter(a => !a.user.bot).size}\nBots: ${members.filter(a => a.user.bot).size}`, true)
    embed.addField("Roles", `${guild.roles.cache.size} Roles`)
    message.channel.send(embed)
  }
}