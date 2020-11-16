import Command from '../../utils/comando.js';
import Discord from 'discord.js';
import config from '../../config/bot.json';


export default class extends Command {
  constructor(options){
    super(options)
    this.usage = "emjify <texto>";
  }
  async run(message, args){
    
    
      const emojis = { "a": "🇦", "b": "🇧", "c": "🇨", "d": "🇩", "e": "🇪", "f": "🇫", "g": "🇬", "h": "🇭", "i": "🇮", "j": "🇯", "k": "🇰", "l": "🇱", "m": "🇲", "n": "🇳", "o": "🇴", "p": "🇵", "q": "🇶", "r": "🇷", "s": "🇸", "t": "🇹", "u": "🇺", "v": "🇻", "w": "🇼", "x": "🇽", "y": "🇾", "z": "🇿", "0": "0⃣", "1": "1⃣", "2": "2⃣", "3": "3⃣", "4": "4⃣", "5": "5⃣", "6": "6⃣", "7": "7⃣", "8": "8⃣", "9": "9⃣", "<": "◀", ">": "▶", "!": "❗", "?": "❓", "^": "🔼", "+": "➕", "-": "➖", "÷": "➗", ".": "🔘", "$": "💲", "#": "#️⃣", "*": "*️⃣" };
  const texto = args.join(" ");
        const error = new Discord.MessageEmbed()
      .setAuthor(
        `Uso adecuado: ${this.usage}`,
        this.client.errorURL
      )
      .setColor("RED");
    
    if(!texto) return message.channel.send(error)
const string = texto.toLowerCase().split("");

        const emojied = string.map(ch => {
            if (/\s/g.test(ch)) {
                return "   ";
            } else if (emojis[ch]) {
                return ` ${emojis[ch]}`;
            } else return ` ${ch}`;
        })
        await message.channel.send(emojied.join(""));
   
    
 
    
    
  }
}