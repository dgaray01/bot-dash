import Command from "../../utils/comando.js";
import Discord from "discord.js";
export default class extends Command {
  constructor(options) {
    super(options);
    this.usage = "poll <question>";
  }
    async run(message, args) {
      message.delete();
      const poll = args.join(" ");
      if(!poll) return;
      const msg = await message.channel.send(`**${message.author.tag}** pregunta: ${poll}`);
      await msg.react("👍")
      await msg.react("👎")
};
}
