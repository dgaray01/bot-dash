import db from "quick.db";
import Discord from "discord.js";
export default async function (client, oldMember, newMember) {
    const channel_db = await db.fetch(`logs_${oldMember.guild.id}`)
    const channel = client.channels.resolve(channel_db)
    const embed = new Discord.MessageEmbed();
    if (oldMember.roles.cache.size > newMember.roles.cache.size) {
        embed.setColor("RED");
        embed.setAuthor(newMember.user.tag, newMember.user.displayAvatarURL({ dynamic: true }));
        oldMember.roles.cache.forEach(role => {
            if (!newMember.roles.cache.has(role.id)) {
                embed.addField("Role removido", role);
            }
        });
    } else if (oldMember.roles.cache.size < newMember.roles.cache.size) {
        embed.setColor("GREEN");
        embed.setAuthor(newMember.user.tag, newMember.user.displayAvatarURL({dynamic: true }));        
        newMember.roles.cache.forEach(role => {
            if (!oldMember.roles.cache.has(role.id)) {
                embed.addField("Role agregado", role);
            }
        });
    }
  if (oldMember.nickname !== newMember.nickname) {
      embed.setAuthor(`${newMember.user.tag}`, `${newMember.user.displayAvatarURL({ dynamic: true })}`)
      embed.setColor("GREEN")
      embed.setDescription(`**${newMember} nickname changed**`)
      embed.addField("Antes", oldMember.nickname || "Sin Apodo")
      embed.addField("Ahorr", newMember.nickname || "Sin Apodo");
  }
  if (oldMember.username !== newMember.username) {
      embed.setAuthor(`${newMember.user.tag}`, `${newMember.user.displayAvatarURL({ dynamic: true })}`)
      embed.setColor("GREEN")
      embed.setDescription(`**${newMember} cambio de username**`)
      embed.addField("Antes", oldMember.user.username)
      embed.addField("Ahorr", newMember.user.username)
  }
  if(!channel) return;
   channel.send(embed)
}