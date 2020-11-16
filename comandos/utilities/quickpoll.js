import Command from "../../utils/comando.js";
import Discord from "discord.js";
export default class extends Command {
  constructor(options) {
    super(options);
    this.usage = "quickpoll <question | answers...>";
  }
    async run(message, args) {
      message.delete();
      const poll = args.join(" ");
      if(!poll) return message.channel.send("Uso: quickpoll  pregunta | respuesta a | respuesta b | respuesta c \ nSe requieren al menos dos respuestas.")
      const poll_post = poll.split(" | ")
      const title = poll_post[0]
      if(!poll_post[1] && !poll_post[2]) return message.channel.send("Necesita al menos una pregunta con dos opciones. Tengo 1 opción");
      const answers = poll_post.slice(1)
      if(answers.length >= 11) return message.channel.send("No se puede mas de 10 respuestas")
      const numeros1 = ["1⃣", "2⃣", "3⃣", "4⃣", "5⃣",  "6⃣", "7⃣",  "8⃣", "9⃣", "🔟"];
      const numeros = numeros1.slice(0, answers.length)
      const msg = await message.channel.send(`${message.author.tag} pregunta: ${title}\n\n${numeros.map((a, i) => `${a}: ${answers[i]}`).join("\n")}`);
      for await (let xd of numeros) {
        await msg.react(xd);
        await Discord.Util.delayFor(1500);
    };
};
}
