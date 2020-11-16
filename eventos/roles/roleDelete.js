import db from "quick.db";
import Discord from "discord.js";
export default async function (client, role) {
  const channel_db = await db.fetch(`logs_${role.guild.id}`)
  const channel = client.channels.resolve(channel_db)
  const embed = new Discord.MessageEmbed();
  embed.setTitle("Rol eliminado")
  embed.addField("Rol", role.name)
  embed.setThumbnail(role.guild.iconURL({dynamic: true}));
  embed.setColor("RED");
    if(!channel) return;
   channel.send(embed)
  }