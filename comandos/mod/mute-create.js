import Command from '../../utils/comando.js';
import Discord from 'discord.js';
import quick from "quick.db";
const db = new quick.table("mute");
const db2 = new quick.table("mute_role");
export default class extends Command {
  constructor(options){
    super(options)
    this.usage = "mute-create [name='muted']";
  }
  async run(message, args) {
  const embed = new Discord.MessageEmbed();
  const mute_role_name = args.join(" ");
  if(!message.guild.me.hasPermission("ADMINISTRATOR")){
    embed.setAuthor(`No puedo crear por falta de permiso de administrador`,this.client.errorURL)
    embed.setColor("RED");
    return message.channel.send(embed)
  };  
  if(!message.member.hasPermission('ADMINISTRATOR')){
    embed.setAuthor(`Nesesitas permisos para poder usar este comando`,this.client.errorURL)
    embed.setColor("RED");
    return message.channel.send(embed)
  };
  if(!mute_role_name) {
    embed.setAuthor(`No has proporcionado un nombre para el rol`,this.client.errorURL)
    embed.setColor("RED");
    return message.channel.send(embed)
  };
  const role_mute = await message.guild.roles.create({
  data: {
    name: mute_role_name
  }, })
  message.guild.channels.cache.forEach(async channel => {
    await channel.updateOverwrite(role_mute.id, {
        SEND_MESSAGES: false,
    });
    })
    
    await message.channel.send(`Rol creado **${role_mute}**`);
db2.set(`muterole_${message.guild.id}`, role_mute.id);
}
}