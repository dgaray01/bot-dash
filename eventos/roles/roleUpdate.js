import db from "quick.db";
import Discord from "discord.js";
export default async function (client, oldRole, newRole) {
  const channel_db = await db.fetch(`logs_${newRole.guild.id}`)
  const channel = client.channels.resolve(channel_db)
  const embed = new Discord.MessageEmbed();
  if(oldRole.name !== newRole.name){
  embed.setTitle("Nombre de Rol cambiado");
  embed.setThumbnail(newRole.guild.iconURL({dynamic: true}));
  embed.setDescription(`Nombre antiguo:\n **${oldRole.name}**\nNombre actual:\n **${newRole.name}** `);
  embed.setColor("GREEN");
  embed.setFooter(newRole.guild.name, newRole.guild.iconURL({dynamic: true}))
  } 
  if (!oldRole.permissions.equals(newRole.permissions)) {
    const r1 = oldRole.permissions.missing(newRole.permissions)
    const r2 = newRole.permissions.missing(oldRole.permissions)
    embed.setTitle("Permiso de Rol cambiado");
    embed.setThumbnail(newRole.guild.iconURL({dynamic: true}));
    embed.setColor("GREEN");
    embed.setFooter(newRole.guild.name, newRole.guild.iconURL({dynamic: true}))
    console.log(r1, r2)
    if(r1.length) {
    embed.addField("Permiso agregados:",r1.join(" "));
    } 
    if (r2.length) {
    embed.addField("Permiso removidos:", r2.join(" "));
    }
  }
  if (oldRole.hexColor !== newRole.hexColor) {
    embed.setTitle("Color de Rol cambiado");
    embed.setThumbnail(newRole.guild.iconURL({dynamic: true}));
    embed.addField("Color antiguo", oldRole.hexColor);
    embed.addField("Color nuevo", newRole.hexColor);
    embed.setColor(newRole.hexColor);
    embed.setFooter(newRole.guild.name, newRole.guild.iconURL({dynamic: true}))
  }
  if (oldRole.rawPosition !== newRole.rawPosition) {
    embed.setTitle("Posicion de Rol cambiado");
    embed.setThumbnail(newRole.guild.iconURL({dynamic: true}));
    if(newRole.rawPosition > oldRole.rawPosition) {
      embed.addField(`El rol ${newRole.name} aumento en`, `${newRole.rawPosition - oldRole.rawPosition} posiciones`);
    } else {
      embed.addField(`El rol ${newRole.name} bajo en`, `${oldRole.rawPosition - newRole.rawPosition} posiciones`);
    }
    embed.setColor("GREEN");
    embed.setFooter(newRole.guild.name, newRole.guild.iconURL({dynamic: true}))
  }
  if (oldRole.hoist !== newRole.hoist) {
    embed.setTitle("Ajustes de Rol cambiado");
    embed.setThumbnail(newRole.guild.iconURL({dynamic: true}));
    if(newRole.hoist) {
      embed.setDescription(`Ahora los miembros con el rol **${newRole.name}** se mostraran por separados que los de en linea`);
      embed.setColor("GREEN");
    } else {
      embed.setDescription(`Ahora los miembros con el rol **${newRole.name}** ya no se mostraran por separados que los de en linea`);
      embed.setColor("RED");
    }
    embed.setFooter(newRole.guild.name, newRole.guild.iconURL({dynamic: true}))
  }
  if (oldRole.mentionable !== newRole.mentionable) {
    embed.setTitle("Ajustes de Rol cambiado");
    embed.setThumbnail(newRole.guild.iconURL({dynamic: true}));
    if(newRole.mentionable) {
      embed.setDescription(`Ahora el rol **${newRole.name}** ya se puede mencionar`);
      embed.setColor("GREEN");
    } else {
      embed.setDescription(`Ahora el rol **${newRole.name}** ya no se puede mencionar`);
      embed.setColor("RED");
    }
    embed.setFooter(newRole.guild.name, newRole.guild.iconURL({dynamic: true}))
  } else {
    return;
  }
  if(!channel) return;
   channel.send(embed)
}