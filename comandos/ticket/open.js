import Command from '../../utils/comando.js';
import Discord from 'discord.js';
import quick from "quick.db";
const ticketDB = new quick.table("ticket");
export default class extends Command {
  constructor(options){
    super(options)
    this.usage = "open";
  }
  async run(message, args){
    const ticket = ticketDB.get(message.guild.id)
    const tickets = ticket.panels.find(a => a.tickets.find(xd => xd.channelID === message.channel.id))
    if(!tickets) return;
    const the_Ticket = tickets.tickets.find(xd => xd.channelID === message.channel.id);
    await message.delete();
    if(the_Ticket.resolved) {
      const embed_ticket_delete = new Discord.MessageEmbed()
      embed_ticket_delete.setColor("GREEN");
      embed_ticket_delete.setDescription(`Ticket abierto por ${message.author}`)
      await message.channel.send(embed_ticket_delete)
      await message.channel.setName(`ticket-${(the_Ticket.tickets_lenght.toString()).padStart(4, 0)}`)
      message.channel.updateOverwrite(the_Ticket.authorID, {
        VIEW_CHANNEL: true,
        SEND_MESSAGES: true
      })
      const number = ticket.panels.findIndex(a => a.tickets.find(xd => xd.channelID === message.channel.id));
      const number2 = ticket.panels[number].tickets.findIndex(a => a.channelID === message.channel.id);
      ticket.panels[number].tickets[number2].resolved = false;
      await ticketDB.set(`${message.guild.id}.panels`, ticket.panels)
    }
  }
}