import Command from '../../utils/comando.js';
import Discord from 'discord.js';
import config from '../../config/bot.json';
import fn from 'fortnite'
// Create an instance of the client with your API Key
const fortnite = new fn(process.env.FORTNITE_KEY);

export default class extends Command {
  constructor(options){
    super(options)
    this.usage = "fn <usuario>";
  }
  async run(message, args){
    try{
      
      
          const error = new Discord.MessageEmbed()
      .setAuthor(
        `Uso adecuado: ${this.usage}`,
        this.client.errorURL
      )
      .setColor("RED");
      
      
  if(!args.join(" ")) return message.channel.send(error)
   const Fortnite_user = await fortnite.user(args.join(" "), 'psn')
   const embed = new Discord.MessageEmbed();
  embed.setAuthor(`Informacion de ${Fortnite_user.username}`, "https://cdn.discordapp.com/emojis/713849182510645339.png?v=1")
  embed.addField("Stats Solo:",
  `**Score**: ${Fortnite_user.stats.solo.score}
  **Kills**: ${Fortnite_user.stats.solo.kills}
  **Wins**: ${Fortnite_user.stats.solo.wins}
  **Matches**: ${Fortnite_user.stats.solo.matches}`, true)
  embed.addField("Stats Duo:",
  `**Score**: ${Fortnite_user.stats.duo.score}
  **Kills**: ${Fortnite_user.stats.duo.kills}
  **Wins**: ${Fortnite_user.stats.duo.wins}
  **Matches**: ${Fortnite_user.stats.duo.matches}`, true) 
  embed.addField("Stats Squad:",
  `**Score**: ${Fortnite_user.stats.squad.score}
  **Kills**: ${Fortnite_user.stats.squad.kills}
  **Wins**: ${Fortnite_user.stats.squad.wins}
  **Matches**: ${Fortnite_user.stats.squad.matches}`, true) 
   message.channel.send(embed)     
    } catch (err){
      message.channel.send(`El usuario **${args.join(" ")}** no existe `)
    }
  }
}