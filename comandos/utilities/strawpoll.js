import Command from "../../utils/comando.js";
import Discord from "discord.js";
import fetch from "node-fetch"
export default class extends Command {
  constructor(options) {
    super(options);
    this.usage = "strawpoll <question | answers...>";
  }
    async run(message, args) {
      const poll = args.join(" ")
      if(!poll) return message.channel.send("Uso:! Strawpoll pregunta | respuesta a | respuesta b | respuesta c \ nSe requieren al menos dos respuestas.")
      const poll_post = poll.split(" | ")
      const title = poll_post[0]
      if(!poll_post[1] && !poll_post[2]) return message.channel.send("Necesita al menos una pregunta con dos opciones. Tengo 1 opción");
      
      const answers = poll_post.slice(1)
      const body = {
   "title": title,
   "options": answers,
   "multi": true
}
        const request = await fetch("https://www.strawpoll.me/api/v2/polls", {
        method: 'post',
        body: JSON.stringify(body)
        });
        const json = await request.json();
      message.channel.send(`https://www.strawpoll.me/${json.id}`)
    };
};