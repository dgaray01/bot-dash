import Command from '../../utils/comando.js';
import Discord from 'discord.js';
import config from '../../config/bot.json';
import util from 'util';
import ms from "ms";
import quick from "quick.db";
const db = new quick.table("mute");
const db2 = new quick.table("mute_role");

export default class extends Command {
  constructor(options){
    super(options)
    this.usage = "mute <@member/ID> [time] [reason]";
  }
  async run(message, args){
  const embed = new Discord.MessageEmbed();
  
  const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
  let time = args[1];
  let reason = args.slice(2).join(" ") || `Miembro muteado por ${message.author.username}`
  const muterole = await db2.fetch(`muterole_${message.guild.id}`);
  if(!message.guild.me.hasPermission("MANAGE_ROLES")){
    embed.setAuthor(`No puedo mutear por falta de permiso de gestionar roles`,this.client.errorURL)
    embed.setColor("RED");
    return message.channel.send(embed)
  };  
  if(!message.member.hasPermission('MANAGE_ROLES')){
    embed.setAuthor(`Nesesitas permisos para poder usar este comando`,this.client.errorURL)
    embed.setColor("RED");
    return message.channel.send(embed)
  }
  let id = args[0] ? args[0].match(/(?<=(<@!?))(\d{17,19})(?=>)/g) : null;
  let user = id ? message.guild.members.resolve(id[0]) : message.guild.members.resolve(args[0]);
  if(!user) {
    embed.setAuthor(`Uso adecuado: ${this.usage}`,this.client.errorURL)
    embed.setColor("RED");
    return message.channel.send(embed)
  }
  if(target.roles.highest.position >= message.member.roles.highest.position) {
    embed.setAuthor(`No puedes mutear a alguien de mayor o igual jerarquia que la de usted`,this.client.errorURL)
    embed.setColor("RED");
    return message.channel.send(embed)
  };
  if(!target.manageable) {
    embed.setAuthor(`No puedo mutear a alguien de igual o por encima de mi jerarquia de roles`,this.client.errorURL)
    embed.setColor("RED");
    return message.channel.send(embed)
  };
  if(!time) {
    time = reason;
  }
  let timefinally = ms(time)
  if(timefinally && typeof timefinally === "undefined") {
    timefinally = null
    reason = args.slice(1).join(" ") || `Miembro muteado por ${message.author.username}`
  }
  if(timefinally > 3.156e+10) {
    embed.setAuthor(`Tiempo maximo es de 1 año`,this.client.errorURL)
    embed.setColor("RED");
    return message.channel.send(embed)
  };
    if(db.fetch(`muteinfo_${target.id}`))  {
    embed.setAuthor(`El usuario ya se encuentra muteado`,this.client.errorURL)
    embed.setColor("RED");
    return message.channel.send(embed)
  };
    if(timefinally) {
    db.set(`muteinfo_${target.id}`, { 
        guildID: message.guild.id,
        time: Date.now() + timefinally, 
        userID: target.id, 
        reason: reason,
        muteRolID: muterole,
    })
    }
    target.roles.add(muterole)
    message.channel.send(`Usuario muteado **${target.user.tag}**`);
}
}

