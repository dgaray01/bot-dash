import db from "quick.db";
import Discord from "discord.js";
import quick from "quick.db";
import  uid  from 'uid';

export default async function (client, member) {
    const sticky_roles_db = new quick.table("sticky_roles");
    const sticky_roles = sticky_roles_db.fetch(`${member.guild.id}_${member.id}`);
    const autorole_db = new quick.table("autorole");
    const autoroles = autorole_db.fetch(member.guild.id);
    const roles_delay_db = new quick.table("roles_delay");
    const roles_delay = roles_delay_db.fetch(member.guild.id);
  const members_roles_con_delay_db = new quick.table("members_con_delay")
  const members_roles_con_delay = members_roles_con_delay_db.fetch(member.guild.id)
  if(roles_delay && roles_delay.timeroles && roles_delay.timeroles.length) {
    for await (let a of roles_delay.timeroles) {
      await members_roles_con_delay_db.push(`${member.guild.id}.members`, {
      memberID: member.id,
      roleID: a.role,
      time: Date.now() + a.time,
      guildID: member.guild.id,
      ID: uid.uid(8)
    });
    };
  }
  if(!autoroles) return;
  if(!autoroles.activate) return;
  if(autoroles.roles && autoroles.roles.length) {
  member.roles.add(autoroles.roles.filter(a => member.guild.roles.resolve(a) && member.guild.me.roles.highest.position > member.guild.roles.resolve(a).position))
  autorole_db.set(`${member.guild.id}.roles`, autoroles.roles.filter(a => member.guild.roles.resolve(a) && member.guild.me.roles.highest.position > member.guild.roles.resolve(a).position))
  }
  if(!sticky_roles && sticky_roles.roles.length) return;

  member.roles.add(sticky_roles.roles.filter(a => {
    if(!autoroles.blacklist && !autoroles.blacklist.length) return sticky_roles.roles
else return !autoroles.blacklist.includes(a) && member.guild.roles.resolve(a)
  }));
}