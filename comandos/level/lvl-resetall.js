import Command from '../../utils/comando.js';
import Discord from 'discord.js';
import config from '../../config/bot.json';
import util from 'util';
import codeGen from 'random-code-gen'
import sqlite3 from 'sqlite3'
sqlite3.verbose()
const db = new sqlite3.Database("./db/niveles.sqlite");

export default class extends Command {
  constructor(options){
    super(options)
    this.usage = "";
     this.owner = true;
    this.userPerms = [8, 0];
  }
  async run(message, args){
    let code = codeGen.random(4)
    
    const embed = new Discord.MessageEmbed()
    .setAuthor(`¿Estas seguro que quieres ELIMINAR TODA la database?`)
    .setDescription("Escribe el siguiente codigo si estas seguro de lo que estas haciendo ``"+ code+ "``")
    .setColor("GREEN")
    message.reply(embed)
    
let i = 0;
    
    const filter = m => m.author.id === message.author.id;
let myCol = message.channel.createMessageCollector(filter, { time: 60000 })
myCol.on("collect", async m => {
switch(i) {
case 0: 

    if(!code.includes(m.content)){ 
      
      return message.reply("Codigo invalido, vuelve a intentarlo")             
                                 }
    
    
    let SQLDelete = "DELETE FROM userLvl ";

db.run(SQLDelete, function(err) {
    if (err) return console.error(err.message)
})
    
    message.channel.send("DataBase reseteada con exito")

    
    
  if (m.deletable) await m.delete().catch(() => {});





i++
break;


myCol.stop("completo")
}
})

myCol.on("end", async (c, r) => {
if(r === "completo") {





} else {

const error = new Discord.RichEmbed()
.setAuthor("ERROR | Tiempo excedido ", this.client.ErrorURL)
.setColor("RED")
message.channel.send(error).then(msg => {
    msg.delete(10000)
  })

}
})

    
   
    
 
    
    
  }
} 