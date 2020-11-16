import Discord from "discord.js";
import quick from "quick.db";
import moment from "moment";
import momentDurationFormat from "moment-duration-format";
const ticketDB = new quick.table("ticket");
const starboard_db = new quick.table("starboard_role");
const rrdb = new quick.table("reactionroles");
export default async function (client, reaction, user) {
  const message = await reaction.message.fetch();
  if(user.bot) return;
  const starboard = await starboard_db.fetch(message.guild.id);
  const ticketDATA = await ticketDB.fetch(message.guild.id);
  if(reaction.emoji.name === "⭐" && starboard.max && message.reactions.cache.get("⭐").count >= starboard.max) {
  if(!starboard.nsfw && message.channel.nsfw) return;
  if(!starboard.self && message.author.id === user.id) return;
  if(reaction.message.partial) {
  const channel = client.channels.resolve(starboard.channel);
  if(!channel) return;
  const msgs = await channel.messages.fetch({ limit: 100 });
  const exist = await msgs.find(a => a.embeds.length && a.embeds[0].footer.text.startsWith(message.id))
  if(exist) {
    exist.edit(`${message.reactions.cache.get("⭐").count} - ⭐ ${message.channel}`)
  } else {
    const embed = new Discord.MessageEmbed();
    embed.setAuthor(message.author.username, message.author.displayAvatarURL());
    if(message.content.length) {
  embed.setDescription(message.content);
  }
  if(message.attachments.size) {
    embed.setImage(message.attachments.first().url)
  }
  if(starboard.jump){
  embed.addField("Fuente", `[Jump!](${message.url})`)
  }
  embed.setFooter(`${message.id}`);
  embed.setTimestamp();
  embed.setColor("#fff8e4")
  channel.send(`${message.reactions.cache.get("⭐").count} - ⭐ ${message.channel}`,embed)
  }
  } else {
  const channel = client.channels.resolve(starboard.channel);
  if(!channel) return;
  const msgs = await channel.messages.fetch({ limit: 100 });
  const exist = await msgs.find(a => a.embeds.length && a.embeds[0].footer.text.startsWith(message.id))
  if(exist) {
    exist.edit(`${message.reactions.cache.get("⭐").count} - ⭐ ${message.channel}`);
  } else {
  const embed = new Discord.MessageEmbed();
  embed.setAuthor(message.author.username, message.author.displayAvatarURL());
  if(message.content.length) {
  embed.setDescription(message.content);
  }
  if(message.attachments.size) {
    embed.setImage(message.attachments.first().url)
  }
  if(starboard.jump){
  embed.addField("Fuente", `[Jump!](${message.url})`)
  }
  embed.setFooter(`${message.id}`);
  embed.setColor("#fff8e4");
  embed.setTimestamp()
  channel.send(`${message.reactions.cache.get("⭐").count} - ⭐ ${message.channel}`,embed)  
  }
}
  } else if(ticketDATA && ticketDATA.panels.find(a => a.messageID === message.id)) {
    await reaction.users.remove(user.id);
    const ticketConfig = ticketDATA.panels.find(a => a.messageID === message.id);
    if(ticketConfig) {
      const FIND_USER = ticketConfig.tickets.filter(a => a.authorID === user.id && !a.resolved)
    if(FIND_USER.length) {
      return client.users.resolve(FIND_USER[0].authorID).send("Usted ya tiene un ticket abierto").catch(() => { })
    } else {
    const permissions = ticketConfig.roles.map(roleID => ({ allow : ['VIEW_CHANNEL', "SEND_MESSAGES"], id: roleID}))
    const channel = await message.guild.channels.create(`ticket-${(ticketConfig.tickets_lenght.toString()).padStart(4, 0)}`, {
        parent: ticketConfig.parentID,
        type: 'text',
        permissionOverwrites: [
        {
          allow : ['VIEW_CHANNEL', "SEND_MESSAGES"],
          id: user.id
        },
        ...permissions,
        {
          deny : 'VIEW_CHANNEL', id: message.guild.id
        },
        {
          allow: ['MANAGE_CHANNELS','ADD_REACTIONS','VIEW_CHANNEL','SEND_MESSAGES','MANAGE_MESSAGES','EMBED_LINKS','ATTACH_FILES','READ_MESSAGE_HISTORY','MANAGE_ROLES'],
          id: client.user.id
        }
        ]
    })
    const embed = new Discord.MessageEmbed();
    embed.setDescription(ticketConfig.description_tickets)
    const msg = await channel.send(`${user} Bienvenido`, embed)
    await msg.react("🔒")
    const Ticket = {
      authorID: user.id,
      channelID: channel.id,
      guildID: message.guild.id,
      resolved: false,
      closeMessageID: msg.id,
      tickets_lenght: ticketConfig.tickets_lenght,
      ticket_recovery: {
        closeMessageID: null,
        closeChannelID: null,
      }
    }
    const tickets = ticketConfig.tickets;
    tickets.push(Ticket);
    const number = ticketDATA.panels.findIndex(a => a.messageID === message.id);
    ticketDATA.panels[number].tickets = tickets
    ticketDATA.panels[number].tickets_lenght = ++ticketDATA.panels[number].tickets_lenght
    await ticketDB.set(`${message.guild.id}.panels`, ticketDATA.panels)
    return;
    }
    }
  } else if(reaction.emoji.name === "🔒") {
    const ticket = ticketDATA.panels.find(a => a.tickets.find(xd => xd.channelID === message.channel.id))
    if(ticket) {
      const the_Ticket = ticket.tickets.find(xd => xd.channelID === message.channel.id)
        if(message.id === the_Ticket.closeMessageID && !the_Ticket.resolved) {
        await reaction.users.remove(user.id);
        const msg = await client.channels.resolve(the_Ticket.channelID).messages.fetch(the_Ticket.closeMessageID)
        await msg.react("❎")
        await msg.react("✅")
      }
    }
  } else if (reaction.emoji.name === "❎") {
      const ticket = ticketDATA.panels.find(a => a.tickets.find(xd => xd.channelID === message.channel.id))
      if(ticket) {
        const the_Ticket = ticket.tickets.find(xd => xd.channelID === message.channel.id);
        if(message.id === the_Ticket.closeMessageID) {
          await reaction.users.remove(user.id);
          const msg = await client.channels.resolve(the_Ticket.channelID).messages.fetch(the_Ticket.closeMessageID)
          await msg.reactions.cache.find(a => a._emoji.name === "✅").remove()
          await msg.reactions.cache.find(a => a._emoji.name === "❎").remove()
        }
      }
  } else if (reaction.emoji.name === "✅") {
      const ticket = ticketDATA.panels.find(a => a.tickets.find(xd => xd.channelID === message.channel.id))
      if(ticket) {
        const the_Ticket = ticket.tickets.find(xd => xd.channelID === message.channel.id);
        if(message.id === the_Ticket.closeMessageID) {
          await reaction.users.remove(user.id);
          if(!the_Ticket.resolved) {
          const channel = client.channels.resolve(the_Ticket.channelID)
          await channel.setName(`closed-${(the_Ticket.tickets_lenght.toString()).padStart(4, 0)}`)
          channel.updateOverwrite(the_Ticket.authorID, {
            VIEW_CHANNEL: false,
            SEND_MESSAGES: false
          })
          const embed_ticket_delete = new Discord.MessageEmbed()
          embed_ticket_delete.setColor("YELLOW");
          embed_ticket_delete.setDescription(`Ticket Cerrado por ${user}`)
          await channel.send(embed_ticket_delete)
          const embed_ticket_delete_2 = new Discord.MessageEmbed();
          embed_ticket_delete_2.setColor("RED");
          embed_ticket_delete_2.setDescription(`📑 Guardar transcripción\n🔓Reabrir Ticket\n⛔Eliminar Ticket`)
          const message_ticket_close = await channel.send(embed_ticket_delete_2)
          await message_ticket_close.react("📑")
          await message_ticket_close.react("🔓")
          await message_ticket_close.react("⛔");
          const number = ticketDATA.panels.findIndex(a => a.tickets.find(xd => xd.channelID === message.channel.id));
          const number2 = ticketDATA.panels[number].tickets.findIndex(a => a.channelID === message.channel.id);
          ticketDATA.panels[number].tickets[number2].resolved = true;
          ticketDATA.panels[number].tickets[number2].ticket_recovery = {
            closeMessageID: message_ticket_close.id,
            closeChannelID: channel.id
          }
          await ticketDB.set(`${message.guild.id}.panels`, ticketDATA.panels)
          }
        }
      }
  } else if(reaction.emoji.name === "📑") {
    const ticket = ticketDATA.panels.find(a => a.tickets.find(xd => xd.ticket_recovery.closeChannelID === message.channel.id))
    if(ticket) {
      const the_Ticket = ticket.tickets.find(xd => xd.channelID === message.channel.id);
      if(message.id === the_Ticket.ticket_recovery.closeMessageID) {
        const messages = await message.channel.messages.fetch({ limit: 100 });
        console.log(`${messages.size} procuradas.`);
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
  } else if(reaction.emoji.name === "🔓") {
    const ticket = ticketDATA.panels.find(a => a.tickets.find(xd => xd.ticket_recovery.closeChannelID === message.channel.id))
    if(ticket) {
      const the_Ticket = ticket.tickets.find(xd => xd.channelID === message.channel.id);
      if(message.id === the_Ticket.ticket_recovery.closeMessageID) {
          const embed_ticket_delete = new Discord.MessageEmbed()
          embed_ticket_delete.setColor("GREEN");
          embed_ticket_delete.setDescription(`Ticket abierto por ${user}`)
          await message.channel.send(embed_ticket_delete)
          await message.channel.setName(`ticket-${(the_Ticket.tickets_lenght.toString()).padStart(4, 0)}`)
          message.channel.updateOverwrite(the_Ticket.authorID, {
            VIEW_CHANNEL: true,
            SEND_MESSAGES: true
          })
          const number = ticketDATA.panels.findIndex(a => a.tickets.find(xd => xd.channelID === message.channel.id));
          const number2 = ticketDATA.panels[number].tickets.findIndex(a => a.channelID === message.channel.id);
          ticketDATA.panels[number].tickets[number2].resolved = false;
          await ticketDB.set(`${message.guild.id}.panels`, ticketDATA.panels)
        await message.delete()
        }
      }
  }
  else if(reaction.emoji.name === "⛔") {
    const ticket = ticketDATA.panels.find(a => a.tickets.find(xd => xd.ticket_recovery.closeChannelID === message.channel.id))
    if(ticket) {
      const the_Ticket = ticket.tickets.find(xd => xd.channelID === message.channel.id);
      if(message.id === the_Ticket.ticket_recovery.closeMessageID) {
        message.channel.send("El canal se eliminara en 5 segundos")
        setTimeout(() => message.channel.delete(), 5000)
        }
      }
  }
     const rrole = rrdb.all().find((data) => data.ID == reaction.message.id)
         if(!rrole) return;

    const member = client.guilds.resolve(message.guild.id).member(user);

    for(const data of rrole.data){
      const emoji1 = client.emojis.cache.find((x) => x.id == data.emoji) ? Discord.Util.parseEmoji(client.emojis.cache.find((x) => x.id == data.emoji).toString()) : Discord.Util.parseEmoji(data.emoji)
      const emoji2 = Discord.Util.parseEmoji(reaction._emoji.toString());
      if(!emoji1.id && !emoji2.id){
        if(emoji1.name == emoji2.name){
          const roleData = rrole.data.find((x) => x.emoji == emoji2.name);
          if(!roleData) return;
          const role = reaction.message.guild.roles.resolve(roleData.role);
          reaction.users.remove(user);
          if(member.roles.cache.has(role.id)) return member.roles.remove(role.id);
            else member.roles.add(role.id);
        }
      } else {
        if(emoji1.id == emoji2.id){
          const roleData = rrole.data.find((x) => x.emoji == emoji2.id);
          if(!roleData) return;
          const role = reaction.message.guild.roles.resolve(roleData.role);
          reaction.users.remove(user);
          if(member.roles.cache.has(role.id)) return member.roles.remove(role.id);
            else member.roles.add(role.id);
        }
      }
    }
  
  
}
