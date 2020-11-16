import Command from '../../utils/comando.js';
import Discord from 'discord.js';
import config from '../../config/bot.json';
import util from 'util';
import ytdl from 'ytdl-core';
import search from 'youtube-search';
import quick from "quick.db";
const db = new quick.table("dj_role");
export default class extends Command {
  constructor(options){
    super(options)
    this.usage = "volumen <1 al 100>";
  }
  async run(message, args){
    const queue = this.client.queue
  const serverQueue = this.client.queue.get(message.guild.id);
  const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.channel.send('¡Necesitas unirte a un canal de voz para reproducir música!');
    const permissions = voiceChannel.permissionsFor(this.client.user);
    if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
      return message.channel.send('¡Necesito permisos para unirme y/o hablar en el canal de Voz!');
    };
    const embed = new Discord.MessageEmbed();
     if (!serverQueue) {
      embed.setAuthor("No hay nada en la queue")
      embed.setColor("RED")
      return message.channel.send(embed);
    }
   if (!serverQueue) {
      embed.setAuthor("There is nothing in the queue");
      return message.channel.send(embed);
    }
  
  const queue_guild = serverQueue.songs
  let queue_reduce = [];
  let k = 10
  for (let i = 0; i < queue_guild.length; i += 10) {
    const owo = queue_guild.slice(i, i + 10)
    let j = i;
    k += 10
    let info = owo.map(song => `**${++j})** ${song.title} - pedido by ${song.author}`).join("\n")
    queue_reduce.push(info)
  }
  let index = 0;
  let maximum = queue_reduce.length - 1;
    embed.setAuthor(`Queue de ${message.guild.name}`,this.client.user.displayAvatarURL())
    embed.setDescription(queue_reduce[index])
    embed.setFooter(`${index + 1}/${maximum + 1}`)
    embed.setColor("BLUE");
    embed.setThumbnail(this.client.user.displayAvatarURL())
    const msg = await message.channel.send(embed);
    const filter = (reaction, user) => {
    return (
      ["⬅️", "➡️", "❌"].includes(reaction.emoji.name) &&
      user.id === message.author.id
    );
  };
      if(queue_reduce.length === 1) return;
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
    embed.setDescription(queue_reduce[index]); 
    embed.setFooter(`${index + 1}/${maximum + 1}`)
        await msg.edit(embed);
      }
    }
    if (reaction.emoji.name === "⬅️") {
      await reaction.users.remove(user.id);
      if (index !== 0) {
        index--
    embed.setDescription(queue_reduce[index]); 
    embed.setFooter(`${index + 1}/${maximum + 1}`)
        await msg.edit(embed);
      }
    }
    if (reaction.emoji.name === "❌") {
      await msg.edit(`${message.author} ha cerrado el paginador de queue`, { embed: null })
      await collector.stop();
    }
  });
  collector.on("end", (collected) => msg.reactions.removeAll());
    
}
}