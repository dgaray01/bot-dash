import Command from '../../utils/comando.js';
import Discord from 'discord.js';
import quick from "quick.db";
const ticketDB = new quick.table("ticket");
export default class extends Command {
  constructor(options){
    super(options)
    this.usage = "ticket-create <canal> | <canal-de-categoria> | <titulo> | <descripcion-de-tickets> | <roles...>";
  }
  async run(message, args){
  const embed = new Discord.MessageEmbed();
  if(!message.guild.me.hasPermission("MANAGE_GUILD")){
    embed.setAuthor(
    `No puedo establecer ese canal por falta de permisos`,
    this.client.errorURL
    )
    embed.setColor("RED");
    return message.channel.send(embed)
  }
  if(!message.member.hasPermission("MANAGE_GUILD")){
    embed.setAuthor(`Nesesitas permisos para poder usar este comando`,this.client.errorURL)
    embed.setColor("RED");
    return message.channel.send(embed)
  }
  const text = args.join(" ").split(" | ")
  const id = text[0] ? text[0].match(/(?<=(<#))(\d{17,19})(?=>)/g) : null;
  const channel = id ? this.client.channels.resolve(id[0]) : this.client.channels.resolve(text[0]);
  if(!channel) {
    embed.setAuthor(`Uso adecuado: ${this.usage}`,this.client.errorURL)
    embed.setColor("RED");
    return message.channel.send(embed)
  }
  const categoryid = text[1] ? text[1].match(/(?<=(<#))(\d{17,19})(?=>)/g) : null;
  const categoryChanel = categoryid ? this.client.channels.resolve(categoryid[0]) : this.client.channels.resolve(text[1]);
  if(!categoryChanel) {
    embed.setAuthor(`Uso adecuado: ${this.usage}`,this.client.errorURL)
    embed.setColor("RED");
    return message.channel.send(embed)
  }
  const title = text[2]
  if(!title){
    embed.setAuthor(`Uso adecuado: ${this.usage}`,this.client.errorURL)
    embed.setColor("RED");
    return message.channel.send(embed)
  }
  const description = text[3]
  if(!description) {
    embed.setAuthor(`Uso adecuado: ${this.usage}`,this.client.errorURL)
    embed.setColor("RED"); 
  }
  if(!text[4]) {
    embed.setAuthor(`Uso adecuado: ${this.usage}`,this.client.errorURL)
    embed.setColor("RED"); 
    return message.channel.send(embed)
  }
  const roles = text[4].split(" ")
  let roleID = []
  for await (let a of roles) {
    const id = a ? a.match(/(?<=(<@&))(\d{17,19})(?=>)/g) : null;
    if(id) {
    if(message.guild.roles.resolve(id[0])) roleID.push(id[0])
    if(message.guild.roles.resolve(a)) roleID.push(a)
    }
  }
  embed.setTitle(title)
  embed.setDescription("Para crear un ticket, reacciona con: 📩")
  const msg = await channel.send(embed)
  await msg.react("📩");
  ticketDB.push(`${message.guild.id}.panels`, {
      messageID: msg.id,
      guildID: msg.guild.id,
      channelID: channel.id,
      roles: roleID,
      panelName: title,
      tickets: [],
      parentID: categoryChanel.id,
      description_tickets: description,
      tickets_lenght: 1
  });
  await message.channel.send(`Ticket Creado en el canal ${channel}`)
  }
}
