import db from "quick.db";
import Discord from "discord.js";
export default async function (client, role) {
  const channel_db = await db.fetch(`logs_${role.guild.id}`)
  const channel = client.channels.resolve(channel_db)
  const embed = new Discord.MessageEmbed();
  embed.setTitle("Nuevo Rol creado")
  embed.addField("Rol", role.name)
  embed.setThumbnail(role.guild.iconURL({dynamic: true}));
  embed.setColor("GREEN");
    if(!channel) return;
   channel.send(embed)
  }