import Command from '../../utils/comando.js';
import Discord from 'discord.js';
import quick from "quick.db";
import moment from "moment";
import momentDurationFormat from "moment-duration-format";
const ticketDB = new quick.table("ticket");
export default class extends Command {
  constructor(options){
    super(options)
    this.usage = "transcript";
  }
  async run(message, args){
    const ticket = ticketDB.get(message.guild.id)
    const tickets = ticket.panels.find(a => a.tickets.find(xd => xd.channelID === message.channel.id))
    if(!tickets) return;
    const the_Ticket = tickets.tickets.find(xd => xd.channelID === message.channel.id);
    const messages = await message.channel.messages.fetch({ limit: 100 });
    let finalArray = [];
    for (const msg of messages.array().reverse()) {
      finalArray.push(`${moment.duration(msg.createdTimestamp).format("DD/MM/YYYY - hh:mm:ss")} ${msg.author.username} : ${msg.content}`); 
    }
        // console.log();
        // console.log(finalArray.length)
        const xd = new Discord.MessageAttachment(Buffer.from(finalArray.join("\n")), "transcript.txt");
        message.channel.send(xd)
    }
  }
