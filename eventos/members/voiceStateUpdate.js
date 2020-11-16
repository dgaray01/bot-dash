import db from "quick.db";
import Discord from "discord.js";
export default async function (client, oldState, newState	) {
    const channel_db = await db.fetch(`logs_${(oldState.channel || newState.channel).guild.id}`)
    const channel = client.channels.resolve(channel_db)
    const embed = new Discord.MessageEmbed()
    if(!oldState.channel && newState.channel){
    embed.setTitle("Usuario se conecto al canal de voz");
    embed.setThumbnail(newState.channel.guild.iconURL({dynamic: true}));
    embed.setDescription(`El miembro:\n **${newState.member.user.tag}**\nCanal:\n ${newState.channel}`);
    embed.setColor("GREEN");
    embed.setFooter(newState.channel.guild.name, newState.channel.guild.iconURL({dynamic: true}))
    }
  if(oldState.channel && !newState.channel){
    embed.setTitle("Usuario se conecto al canal de voz");
    embed.setThumbnail(oldState.channel.guild.iconURL({dynamic: true}));
    embed.setDescription(`El miembro:\n **${oldState.member.user.tag}**\nCanal:\n ${oldState.channel}`);
    embed.setColor("RED");
    embed.setFooter(oldState.channel.guild.name, oldState.channel.guild.iconURL({dynamic: true}))
  }
  if(oldState.channel && newState.channel && oldState.channel.id !== newState.channel.id){
    embed.setTitle("Usuario se cambio de canal de voz");
    embed.setThumbnail(oldState.channel.guild.iconURL({dynamic: true}));
    embed.setDescription(`El miembro:\n **${oldState.member.user.tag}**\nCanal:\n ${oldState.channel}`);
    embed.setColor("RED");
    embed.setFooter(oldState.channel.guild.name, oldState.channel.guild.iconURL({dynamic: true}))
  };
  if(newState.deaf !== oldState.deaf && newState.deaf) {
    embed.setTitle("Usuario se ha encordecido");
    embed.setThumbnail(newState.channel.guild.iconURL({dynamic: true}));
    embed.setDescription(`El miembro:\n **${newState.member.user.tag}**`);
    embed.setColor("RED");
    embed.setFooter(newState.channel.guild.name, newState.channel.guild.iconURL({dynamic: true}))
  };
  if(newState.deaf !== oldState.deaf && !newState.deaf) {
    embed.setTitle("Usuario se ha desactivado ensordecimiento");
    embed.setThumbnail(newState.channel.guild.iconURL({dynamic: true}));
    embed.setDescription(`El miembro:\n **${newState.member.user.tag}**`);
    embed.setColor("GREEN");
    embed.setFooter(newState.channel.guild.name, newState.channel.guild.iconURL({dynamic: true}))
  };
  if(newState.mute !== oldState.mute && newState.mute) {
    embed.setTitle("El Usuario se ha muteado");
    embed.setThumbnail(newState.channel.guild.iconURL({dynamic: true}));
    embed.setDescription(`El miembro:\n **${newState.member.user.tag}**`);
    embed.setColor("RED");
    embed.setFooter(newState.channel.guild.name, newState.channel.guild.iconURL({dynamic: true}))
  };
  if(newState.mute !== oldState.mute && !newState.mute) {
    embed.setTitle("El Usuario se ha desmuteado");
    embed.setThumbnail(newState.channel.guild.iconURL({dynamic: true}));
    embed.setDescription(`El miembro:\n **${newState.member.user.tag}**`);
    embed.setColor("GREEN");
    embed.setFooter(newState.channel.guild.name, newState.channel.guild.iconURL({dynamic: true}))
  };
  if(newState.serverMute !== oldState.serverMute && newState.serverMute) {
    embed.setTitle("El Usuario lo han muteado");
    embed.setThumbnail(newState.channel.guild.iconURL({dynamic: true}));
    embed.setDescription(`El miembro:\n **${newState.member.user.tag}**`);
    embed.setColor("RED");
    embed.setFooter(newState.channel.guild.name, newState.channel.guild.iconURL({dynamic: true}))
  };
  if(newState.serverMute  !== oldState.serverMute  && !newState.serverMute) {
    embed.setTitle("El Usuario lo han desmuteado");
    embed.setThumbnail(newState.channel.guild.iconURL({dynamic: true}));
    embed.setDescription(`El miembro:\n **${newState.member.user.tag}**`);
    embed.setColor("GREEN");
    embed.setFooter(newState.channel.guild.name, newState.channel.guild.iconURL({dynamic: true}))
  };
    if(newState.streaming!== oldState.streaming && newState.streaming) {
    embed.setTitle("Un usuario inicio straming");
    embed.setThumbnail(newState.channel.guild.iconURL({dynamic: true}));
    embed.addField("Miembro", newState.member.user.tag)
    embed.addField("Canal", `${newState.channel}`)
    embed.setColor("GREEN");
    embed.setFooter(newState.channel.guild.name, newState.channel.guild.iconURL({dynamic: true}))
  };
    if(newState.streaming !== oldState.streaming && !newState.streaming) {
    embed.setTitle("El Usuario dejo de stremear");
    embed.addField("Miembro", newState.member.user.tag)
    embed.addField("Canal", `${newState.channel}`)
    embed.setColor("RED");
    embed.setFooter(newState.channel.guild.name, newState.channel.guild.iconURL({dynamic: true}))
  };
  if(newState.selfVideo !== oldState.selfVideo && newState.selfVideo) {
    embed.setTitle("Un usuario encendio su camara");
    embed.setThumbnail(newState.channel.guild.iconURL({dynamic: true}));
    embed.addField("Miembro", newState.member.user.tag)
    embed.addField("Canal", `${newState.channel}`)
    embed.setColor("GREEN");
    embed.setFooter(newState.channel.guild.name, newState.channel.guild.iconURL({dynamic: true}))
  };
  if(newState.selfVideo !== oldState.selfVideo && !newState.selfVideo) {
    embed.setTitle("El Usuario apago su camara");
    embed.addField("Miembro", newState.member.user.tag)
    embed.addField("Canal", `${newState.channel}`)
    embed.setColor("RED");
    embed.setFooter(newState.channel.guild.name, newState.channel.guild.iconURL({dynamic: true}))
  };
  
  if(!channel) return;
   channel.send(embed)
}