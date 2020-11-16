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
    if(!args.length) {
    message.channel.setName(`ticket-${(the_Ticket.tickets_lenght.toString()).padStart(4, 0)}}`)
    } else {
      if(args.join().length > 100) return;
    message.channel.setName(args.join("-"))
    }
  }
}