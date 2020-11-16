import config from '../../config/bot.json';
//Todos los eventos deben devolver via default una función que de primer parámetro sea client.
//Puede ser una función flecha o una función normal
import quick from "quick.db";
const db = new quick.table("mute");
import sqlite3 from 'sqlite3'
import Discord from "discord.js";
import fetch from "node-fetch"

sqlite3.verbose()
const remmindDB = new quick.table("remind");
const sdb = new sqlite3.Database("./db/niveles.sqlite");
export default async function (client) {
  await client.user.setPresence({
    status: config.estado,
    activity: {
      type: "WATCHING",
      name: config.activity,
    },
  });


  
  
  console.log("Bot listo en " + client.user.tag);
  setInterval(async () => {
    const remminders = remmindDB.all();
    for await (let remmind of remminders) {
      const remmindDATA = JSON.parse(remmind.data)
      if(remmindDATA.time < Date.now()) {
      const author = client.users.resolve(remmindDATA.author)
      author.send(`Reminder ${remmindDATA.reason}`)
      await remmind.delete(remmind.ID)
      await Discord.Util.delayFor(3000)
      }
    }
    let caca = await db.all();
    for await (let a of caca) {
      let dataverdadera = JSON.parse(a.data);
      if (dataverdadera.time < Date.now()) {
        const member = client.guilds.resolve(dataverdadera.guildID).member(dataverdadera.userID);
        member.roles.remove(dataverdadera.muteRolID);
        await db.delete(`muteinfo_${dataverdadera.userID}`);
        await Discord.Util.delayFor(3000)
    };
    }
    const members_roles_con_delay_db = new quick.table("members_con_delay");
        for await (let aka of members_roles_con_delay_db.all()) {
          const noooo = (aka.data).members
          for await (let xd of noooo) {
          if(xd && xd.time < Date.now()) {
          const guild = client.guilds.resolve(xd.guildID);
          const member = guild.members.resolve(xd.memberID);
          const role = guild.roles.resolve(xd.roleID)
          member.roles.add(role.id)
          await members_roles_con_delay_db.set(`${xd.guildID}.members`, members_roles_con_delay_db.get(xd.guildID).members.filter(a => a.ID !== xd.ID))
      await Discord.Util.delayFor(3000)
        }
      }
    }
    const autoFeed = new quick.table("auto_feed");
    for await (let dataFeed of autoFeed.all()) {
      const autoFeedDATA = (dataFeed.data).feeds;
      for await (let xd of autoFeedDATA) {
        if(xd && xd.time_send < Date.now()) {
          const guild = client.guilds.resolve(xd.guildID)
          const channel = client.channels.resolve(xd.channelID)
          if(!!xd.infinity) {
            if(!!xd.silent) {
            await channel.send(xd.message)  
            } else {
             await channel.send(`${guild.roles.resolve(xd.roleID)}: ${xd.message}`)
            }
            const array = autoFeed.get(xd.guildID).feeds
            const number = array.findIndex(a => a.ID === xd.ID);
            array[number].time_send = Date.now() + array[number].time
            await autoFeed.set(`${guild.id}.feeds`, array)
          } else {
            if(!!xd.silent) {
            await channel.send(xd.message)  
            } else {
            await channel.send(`${guild.roles.resolve(xd.roleID)}: ${xd.message}`)
            }
            await autoFeed.set(`${guild.id}.feeds`, autoFeed.get(xd.guildID).feeds.filter(a => a.ID !== xd.ID))
        }
      await Discord.Util.delayFor(4000)
        }
      }
    }
    const time_roles = new quick.table("temp_role");
    for await (let time_roleDATA of time_roles.all()) {
      const autoFeedDATA = (time_roleDATA.data).members;
      for await (let xd of autoFeedDATA) {
        if(xd && xd.time < Date.now()) {
        const guild = client.guilds.resolve(xd.guildID)
        const role = guild.roles.resolve(xd.roleID)
        const member = guild.members.resolve(xd.memberID)
        member.roles.remove(role.id)
        await Discord.Util.delayFor(3000)
        }
      }
    }
  }, 10000);
}