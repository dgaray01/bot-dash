import db from "quick.db";
import Discord from "discord.js";
export default async function (client, guild, user) {
    const channel_db = await db.fetch(`logs_${guild.id}`)
    const channel = client.channels.resolve(channel_db)
    const embed = new Discord.MessageEmbed()
    embed.setTitle("Nuevo Usuario Baneado");
    embed.setThumbnail(guild.iconURL({dynamic: true}));
    embed.setDescription(`Usuario baneado:\n **${user.tag}** `);
    embed.setColor("RED");
    embed.setFooter(guild.name, guild.iconURL({dynamic: true}))
  if(!channel) return;
   channel.send(embed)
}