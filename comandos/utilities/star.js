import Command from "../../utils/comando.js";
import Discord from "discord.js";
import quick from "quick.db";
const db = new quick.table("starboard_role");
export default class extends Command {
  constructor(options) {
    super(options);
    this.usage = "star <OPTION>";
  }
  async run(message, args) {
    const embed = new Discord.MessageEmbed();
    if (!message.guild.me.hasPermission("MANAGE_CHANNELS")) {
      embed.setAuthor(`Nesecito permisos`,this.client.errorURL);
      embed.setColor("RED");
      return message.channel.send(embed);
    }
    if (!message.member.hasPermission("MANAGE_CHANNELS")) {
      embed.setAuthor(`Nesesitas permisos para poder usar este comando`,this.client.errorURL);
      embed.setColor("RED");
      return message.channel.send(embed);
    }
    const options = ["limit", "nsfw", "self", "show", "jump"]
    if(!args.join(" ")) return;
    if(args[0] === options[0]){
      if(!args[1]) return;
      const star = parseInt(args[1])
      if(star < 0) return;
      if(isNaN(star)) return;
      await db.set(`${message.guild.id}.max`, star);
      await message.channel.send(`Los mensajes ahora requieren ${star} estrellas para aparecer en el starboard`)
    }
    if(args[0] === options[1]) {
      const nsfw_starboard = await db.fetch(message.guild.id)
      if(nsfw_starboard && nsfw_starboard.nsfw) {
        await db.set(`${message.guild.id}.nsfw`, false);
        await message.channel.send(`Las imágenes de los canales etiquetados como nsfw ya no se incrustarán.`)
        } else {
        await db.set(`${message.guild.id}.nsfw`, true);
          await message.channel.send(`Las imágenes de los canales etiquetados como nsfw ahora se incrustarán.`)
        }
    }
    if(args[0] === options[2]) {
      const self_starboard = await db.fetch(message.guild.id)
      if(self_starboard.self) {
        await db.set(`${message.guild.id}.self`, false);
        await message.channel.send(`Los usuarios ya no pueden destacar sus propios mensajes.`)
        } else {
        await db.set(`${message.guild.id}.self`, true);
          await message.channel.send(`Los usuarios ahora pueden destacar sus propios mensajes.`)
        }
    }
    if(args[0] === options[3]){
      if(!args[1]) return;
      const starboard = await db.fetch(message.guild.id);
      const channel = this.client.channels.resolve(starboard.channel);
      if(!channel) return;
      const msgs = await channel.messages.fetch({ limit: 100 });
      const exist = await msgs.find(a => a.embeds.length && a.embeds[0].footer.text.startsWith(args[1]));
      if(!exist) return message.channel.send("Este mensaje no ha sido destacado.");
      message.channel.send(exist.embeds[0]);
    }
    if(args[0] === options[4] || args[0] === "source") {
      const jump_starboard = await db.fetch(message.guild.id)
      if(jump_starboard.jump) {
        await db.set(`${message.guild.id}.jump`, false);
        await message.channel.send(`Las entradas de starboard ya no mostrarán un enlace al mensaje de origen`)
        } else {
        await db.set(`${message.guild.id}.jump`, true);
          await message.channel.send(`Las entradas de starboard ahora mostrarán un enlace al mensaje de origen.`)
        }
    }
  };
};
