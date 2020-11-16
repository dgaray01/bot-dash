import Command from '../../utils/comando.js';
import Discord from 'discord.js';
import quick from "quick.db";
const ticketDB = new quick.table("ticket");
export default class extends Command {
  constructor(options){
    super(options)
    this.usage = "close";
  }
  async run(message, args){
    const ticket = ticketDB.get(message.guild.id)
    const tickets = ticket.panels.find(a => a.tickets.find(xd => xd.channelID === message.channel.id))
    if(!tickets) return;
    const the_Ticket = tickets.tickets.find(xd => xd.channelID === message.channel.id);
    await message.delete();
    if(!the_Ticket.resolved) {
      const channel = this.client.channels.resolve(the_Ticket.channelID)
      await channel.setName(`closed-${(the_Ticket.tickets_lenght.toString()).padStart(4, 0)}`)
      channel.updateOverwrite(the_Ticket.authorID, {
        deny: ['VIEW_CHANNEL', "SEND_MESSAGES"]
      })
      const embed_ticket_delete = new Discord.MessageEmbed()
      embed_ticket_delete.setColor("YELLOW");
      embed_ticket_delete.setDescription(`Ticket Cerrado por ${message.author}`)
      await channel.send(embed_ticket_delete)
      const embed_ticket_delete_2 = new Discord.MessageEmbed();
      embed_ticket_delete_2.setColor("RED");
      embed_ticket_delete_2.setDescription(`📑 Guardar transcripción\n🔓Reabrir Ticket\n⛔Eliminar Ticket`)
      const message_ticket_close = await channel.send(embed_ticket_delete_2)
      await message_ticket_close.react("📑")
      await message_ticket_close.react("🔓")
      await message_ticket_close.react("⛔");
      const number = ticket.panels.findIndex(a => a.tickets.find(xd => xd.channelID === message.channel.id));
      const number2 = ticket.panels[number].tickets.findIndex(a => a.channelID === message.channel.id);
      ticket.panels[number].tickets[number2].resolved = true;
      ticket.panels[number].tickets[number2].ticket_recovery = {
        closeMessageID: message_ticket_close.id,
        closeChannelID: channel.id
      }
      await ticketDB.set(`${message.guild.id}.panels`, ticket.panels)
    }
  }
}