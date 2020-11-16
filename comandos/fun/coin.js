import Command from '../../utils/comando.js';
import Discord from 'discord.js';
import config from '../../config/bot.json';


export default class extends Command {
  constructor(options){
    super(options)
    this.usage = "coin";
  }
  async run(message, args){
    
   
    
       let respuesta = ["cara", "escudo"]
  var random = respuesta[Math.floor(Math.random() * respuesta.length)]
  
  if(random === "cara"){
    
    
    const embed = new Discord.MessageEmbed()
    .setAuthor(`${message.author.username} | Coin`, message.author.avatarURL())
    .setColor("RANDOM")
    .setDescription("La moneda cayó al lado de la cara")
    .setImage("https://cdn.discordapp.com/attachments/753269829196185764/755174631778025579/fMemdeFmPeYAAAAAASUVORK5CYII.png")
    message.channel.send(embed)
    
  } else if(random === "escudo"){
    
        const embed = new Discord.MessageEmbed()
    .setAuthor(`${message.author.username} | Coin`, message.author.avatarURL())
    .setColor("RANDOM")
    .setDescription("La moneda cayó al lado del escudo")
    .setImage("https://cdn.discordapp.com/attachments/753269829196185764/755174602333749338/AOtIbcrHgWsU7DR3rvwHVJ6d30gKvDQAAAABJRU5ErkJggg.png")
    message.channel.send(embed)
    
  }
    
    
    
  }
}