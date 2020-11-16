import Command from '../../utils/comando.js';
import Discord from 'discord.js';
import config from '../../config/bot.json';
import quick from 'quick.db'
const db = new quick.table("prefix");
const defaultPrefix = config.prefix;
export default class extends Command {
  constructor(options){
    super(options);
    this.userPerms = [8, 0];
    this.guildonly = true;
    this.usage = "prefix <mode> <prefix>";
  }
  async run(message, args){
    if(!args[0]) return this.showUsage(message.channel);
    switch (args[0].toLowerCase()) {
      case "add": {
        if(!args[1]) return message.channel.send("Debes poner un prefix a agregar");
        const prefixes = await db.fetch(message.guild.id);
        if(!prefixes) {
          db.set(message.guild.id, [defaultPrefix, args[1]]);
        } else {
          db.push(message.guild.id, args[1]);
        }
        message.channel.send("Prefijo añadido");
      }
      break;
      case "set": {
        if(!args[1]) return message.channel.send("Debes poner el prefix que será único...");
        db.set(message.guild.id, [args[1]]);
        message.channel.send("Prefijo seteado");
      }
      break;
      case "list": {
        let prefixes = await db.fetch(message.guild.id);
        if(!prefixes) prefixes = [defaultPrefix];
        message.channel.send(new Discord.MessageEmbed().setDescription(prefixes.join("\n")).setColor("BLUE").setFooter(`${prefixes.length} prefixes`))
      }
      break;
      case 'clear': {
        db.set(message.guild.id, [defaultPrefix]);
        message.channel.send("Los prefijos a excepción del original han sido limpiados. Use " + defaultPrefix + " como prefijo...")
      }
      break;
      default: {
        return message.channel.send("Los modos disponibles son `add`, `clear`, `set`, `remove`");
      }
      break;
    }
  }
}
  