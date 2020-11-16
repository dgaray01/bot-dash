import db from "quick.db";
import Discord from "discord.js";
import quick from "quick.db";
export default async function (client, member) {
    const db = new quick.table("sticky_roles");
    db.set(`${member.guild.id}_${member.id}`, {roles: member.roles.cache.array().map(a => a.id)});
    
}