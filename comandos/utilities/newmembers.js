import Command from "../../utils/comando.js";
import Discord from "discord.js";
import moment from "moment";
import momentDurationFormat from "moment-duration-format";
export default class extends Command {
  constructor(options) {
    super(options);
    this.usage = "newmembers";
  }
  async run(message, args) {
       if (!message.member.hasPermission("MANAGE_CHANNELS")) return;
    const members = message.guild.members.cache
      .sort((a, b) => b.joinedAt - a.joinedAt)    
      .array();
    let members_reduce = [];
    for (let i = 0; i < members.length; i += 6) {
    members_reduce.push(members.slice(i, i + 6));
    }
    
      let index = 0;
  let maximum = members_reduce.length - 1;
  const embed = new Discord.MessageEmbed();
  embed.setTitle("Nuevos Miembros")
  embed.setFooter(`${index + 1}/${maximum + 1}`)
  members_reduce[index].map(a => embed.addField(`${a.user.tag} (${a.id})`, `Se unio hace ${moment.duration(Date.now() - a.joinedTimestamp).format("y [years], w [weeks], d [days], h [hours], m [minutes], s [seconds]")}\nCreado hace${moment.duration(Date.now() - a.user.createdAt).format("y [years], w [weeks], d [days], h [hours], m [minutes], s [seconds]")}`))
  embed.setColor("#6e83d0");
  const filter = (reaction, user) => {
    return (
      ["⬅️", "➡️", "❌"].includes(reaction.emoji.name) &&
      user.id === message.author.id
    );
  };
  let msg = await message.channel.send(embed);
  if(members_reduce.length === 1) return;
  await msg.react("⬅️");
  await msg.react("➡️");
  await msg.react('❌');
  let collector = msg.createReactionCollector(filter); //crea un colector de reaciones
  collector.on("collect", async (reaction, user) => {
    if (message.author.id !== user.id) return;
    if (reaction.emoji.name === "➡️") {
      await reaction.users.remove(user.id);
      if (maximum !== index) {
        index++;
        const embed2 = new Discord.MessageEmbed();
        members_reduce[index].map(a => embed2.addField(`${a.user.tag} (${a.id})`, `Se unio hace ${moment.duration(Date.now() - a.joinedTimestamp).format("y [years], w [weeks], d [days], h [hours], m [minutes], s [seconds]")}\nCreado hace ${moment.duration(Date.now() - a.user.createdAt).format("y [years], w [weeks], d [days], h [hours], m [minutes], s [seconds]")}`))
        embed2.setFooter(`${index + 1}/${maximum + 1}`);
        embed2.setColor("#6e83d0");
        await msg.edit(embed2);
      }
    }
    if (reaction.emoji.name === "⬅️") {
      await reaction.users.remove(user.id);
      if (index !== 0) {
        index--;
        const embed3 = new Discord.MessageEmbed();
        members_reduce[index].map(a => embed3.addField(`${a.user.tag} (${a.id})`, `Se unio hace ${moment.duration(Date.now() - a.joinedTimestamp).format("y [years], w [weeks], d [days], h [hours], m [minutes], s [seconds]")}\nCreado hace ${moment.duration(Date.now() - a.user.createdAt).format("y [years], w [weeks], d [days], h [hours], m [minutes], s [seconds]")}`))
        embed3.setFooter(`${index + 1}/${maximum + 1}`);
        embed3.setColor("#6e83d0");
        await msg.edit(embed3);
      }
    }
    if (reaction.emoji.name === "❌") {
      await msg.edit(`${message.author} ha cerrado el paginador de miembros`, { embed: null })
      await collector.stop();
    }
  });
  collector.on("end", (collected) => msg.reactions.removeAll());
  }
  }