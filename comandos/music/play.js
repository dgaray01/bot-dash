import Command from '../../utils/comando.js';
import Discord from 'discord.js';
import config from '../../config/bot.json';
import util from 'util';
import ytdl from 'ytdl-core';
import search from 'youtube-search';
import YouTube from "simple-youtube-api";
import quick from "quick.db";
const db = new quick.table("dj_role");
export default class extends Command {
  constructor(options){
    super(options)
    this.usage = "play <CANCION/URL>";
  }
  async run(message, args){
    const embed = new Discord.MessageEmbed();
    if (!args.length) {
      embed.setAuthor(`Uso adecuado: ${this.usage}`,this.client.errorURL)
      embed.setColor("RED");
      return message.channel.send(embed)
    }
  const youtube = new YouTube(process.env.YOUTUBE_TOKEM);
  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel) return message.channel.send('¡Necesitas unirte a un canal de voz para reproducir música!');
  const permissions = voiceChannel.permissionsFor(this.client.user);
  if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) return message.channel.send('¡Necesito permisos para unirme y/o hablar en el canal de Voz!');
  const queue = this.client.queue;
  const vote = this.client.vote;
  const serverQueue = this.client.queue.get(message.guild.id);
  const playlistPattern = /^.*(youtu.be\/|list=)([^#\&\?]*).*/gi;
  const urlcheck = ytdl.validateURL(args[0]);
  if(playlistPattern.test(args[0])) {
    const playlist = await youtube.getPlaylist(args[0]);
    const videos = await playlist.getVideos();
    const embed = new Discord.MessageEmbed()
      .setAuthor(`Añadido a la Queue`, message.author.displayAvatarURL({dynamic: true}))
      .addField("canciones", playlist.videos.length)
      .setThumbnail(playlist.thumbnails.default.url)
      .setTitle(playlist.title)
      .setURL(playlist.url)
      .setColor("GREEN");
    await message.channel.send(embed);
    for await (var owo of Object.values(videos)) {
      const video_2 = await youtube.getVideoByID(owo.id)
      await handleVideo(video_2, message, voiceChannel, true)  
    }
  } else {
    try {
      var video = await youtube.getVideos(args[0])
      return handleVideo(video, message, voiceChannel)
    } catch (e) {
      try {
        const videos = await youtube.searchVideos(args.join(" "), 1)
        var video = await youtube.getVideoByID(videos[0].id)
          return handleVideo(video, message, voiceChannel)
      } catch (e) {
        console.log(e)
        return message.channel.send("No se encontro la cancion")
      }
    }
  }
  function play(guild, song) {
 const serverQueue = queue.get(guild.id);
 if (!song) {
  serverQueue.voiceChannel.leave();
  queue.delete(guild.id);
  return;
 }
const dispatcher = serverQueue.connection.play(ytdl(song.url, {quality: 'highestaudio',highWaterMark: 1 << 25}))
 .on('finish', () => {
if (serverQueue.loop === true) serverQueue.songs.push(serverQueue.songs.shift());
else serverQueue.songs.shift();
play(guild, serverQueue.songs[0]);
 })
 .on('error', error => {
  console.error(error);
 });
 dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
  };
  async function handleVideo(video, message, voiceChannel, playlist = false) {
  const serverQueue = queue.get(message.guild.id);
  const song = {
    title: Discord.Util.escapeMarkdown(video.title),
    id: video.id,
    url: `https://www.youtube.com/watch?v=${video.id}`,
    author: message.author.username
   };
  if (!serverQueue) {
    const queueObject = {
      textChannel: message.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 5,
      playing: true,
     };
  const voteConstruct = {
      vote: 0,
      voters: []
    }
    try {
      var connection = await voiceChannel.join();
      queueObject.connection = connection;
      if(playlist) {
      } else {
      const embed = new Discord.MessageEmbed()
      .setAuthor(`Añadido a la Queue`, message.author.displayAvatarURL())
      .setThumbnail(`https://img.youtube.com/vi/${song.id}/0.jpg`)
      .setTitle(song.title)
      .setURL(song.url)
      .setColor("GREEN");
      message.channel.send(embed);
      }
      vote.set(message.guild.id, voteConstruct);
      queueObject.songs.push(song);
      queue.set(message.guild.id, queueObject);
      play(message.guild, queueObject.songs[0]);
      
  } catch (err) {
      queue.delete(message.guild.id);
      return console.log(err);
     };
  } else {
    serverQueue.songs.push(song);
    if(!playlist) {
      return message.channel.send(`**${song.title}** ha sido añadido a la cola!, __por: ${message.author.tag}__`);
    }
  };  
    }
}
}
