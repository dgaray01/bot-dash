import Command from "../../utils/comando.js";
import Discord from "discord.js";
import quick from "quick.db";
import ms from "ms";
const db = new quick.table("remind");
export default class extends Command {
  constructor(options) {
    super(options);
    this.usage = "rm <TIEMPO> <DATO>";
    this.aliases = ["rm", "reminder", "remindme","timer"]
  }
  async run(message, args) {
    const time = args[0];
    if(!args[0]) return;
    const timefinnaly = ms(time)
    const reason = args.slice(1).join(" ");
    const embed = new Discord.MessageEmbed();
    if(args[0] === "mine" || args[0] === "list") {
      const todo = db.all()
      const awa = todo.filter(a => JSON.parse(a.data).author === message.author.id);
      if(awa.length){
      return message.channel.send("```" + 
      awa.map(a => `ID: ${a.ID} DATE: ${new Date(JSON.parse(a.data).time).toISOString()} Message: ${JSON.parse(a.data).reason}`).join("\n")
      + "```")
      } else {
        return message.channel.send("El usuario no tiene recordatorios")
      }
    }
    if(args[0] === "-" || args[0] === "remove" || args[0] === "del") {
      if(!args[1]) return;
      const todo = db.all()
      const awa = todo.filter(a => JSON.parse(a.data).author === message.author.id && a.ID === args[1]);
      if(awa.length) {
        db.delete(args[1])
        return message.channel.send("Recordatorio eliminado correctamente.")
      } else {
        return message.channel.send("El usuario no tiene recordatorios")
      }
    }
    if(args[0] === "clear") {
      const todo = db.all()
      const awa = todo.filter(a => JSON.parse(a.data).author === message.author.id);
      if(awa.length) {
        awa.forEach(a => db.delete(a.ID))
        return message.channel.send("Se eliminaron todos los recordatorios")
      } else {
        return message.channel.send("El usuario no tiene recordatorios")
      }
    }
    if(!time || !reason) return;
    if(typeof timefinnaly === "undefined") {
      return message.channel.send("El tiempo no es valido")
    }
    db.set(`${Date.now()}`, {time: Date.now() + timefinnaly, reason: reason, author: message.author.id});
    return message.channel.send("El recordatiorio ha sido establecido");
}
}
