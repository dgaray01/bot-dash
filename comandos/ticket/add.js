import Command from '../../utils/comando.js';
import Discord from 'discord.js';
import quick from "quick.db";
const ticketDB = new quick.table("ticket");
export default class extends Command {
  constructor(options){
    super(options)
    this.usage = "add";
  }
  async run(message, args){
    const ticket = ticketDB.get(message.guild.id)
    const tickets = ticket.panels.find(a => a.tickets.find(xd => xd.channelID === message.channel.id))
    if(!tickets) return;
    const the_Ticket = tickets.tickets.find(xd => xd.channelID === message.channel.id);
    await message.delete();
    const channel = this.client.channels.resolve(the_Ticket.channelID)
    const embed = new Discord.MessageEmbed()
    if(message.mentions.users.size) {
      channel.updateOverwrite(message.mentions.users.first().id, {
        VIEW_CHANNEL: true,
        SEND_MESSAGES: true
      })
      embed.setColor("GREEN")
      embed.setDescription(`${message.mentions.users.first()} agregado a ${channel}`)
      channel.send(embed)
    } else if (message.mentions.roles.size) {
      channel.updateOverwrite(message.mentions.roles.first().id, {
        VIEW_CHANNEL: true,
        SEND_MESSAGES: true
      })
      embed.setColor("GREEN")
      embed.setDescription(`${message.mentions.roles.first()} agregado a ${channel}`)
      channel.send(embed)
    } else {
      return;
    }
  }
}