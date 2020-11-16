import Command from '../../utils/comando.js';
import Discord from 'discord.js';
import config from '../../config/bot.json';
import util from 'util';
import sqlite3 from 'sqlite3'
import Canvas from 'canvas'
sqlite3.verbose()

const db = new sqlite3.Database("./db/niveles.sqlite");

export default class extends Command {
  constructor(options){
    super(options)
    this.usage = "";
  }
  async run(message, args){
    
    
  
     let select = `SELECT * FROM userLvl WHERE id = ${message.author.id}`;
    
 db.get(select, async (err, filas) => {
   if (err) return console.error(err.message)
   if (!filas) return message.channel.send('Sin resultados.')
 
   
     let xpNecesaria = 50 + filas.nivel * 10

   
let usuario = message.mentions.users.first() || message.author
const rank = {exp: 69, level: 110} 

//como ejemplo, agregé 2 fuentes custom
const canvas = Canvas.createCanvas(370,110)
const ctx = canvas.getContext('2d')

//Fondo 
//ctx.fillStyle = "#000"
//ctx.fillRect(0,0,canvas.width,canvas.height)

const fondo = await Canvas.loadImage(filas.bg)
ctx.drawImage(fondo,0,0,canvas.width,canvas.height)
ctx.globalAlpha = filas.opacity
ctx.fillStyle = filas.color
ctx.fillRect(82,9,280,91)
ctx.globalAlpha = 1

//Borde del avatar
ctx.fillStyle = filas.accent
ctx.lineWidth = 0.5
ctx.strokeRect(42,16,78,78)

//Avatar
//discord.js v11:
//const avatar = await Canvas.loadImage(usuario.displayAvatarURL)
//discord.js v12: (es importante que no sea dinámico)
const avatar = await Canvas.loadImage(usuario.displayAvatarURL({dynamic:false,size:256,format:"png"}))
ctx.drawImage(avatar, 44, 18, 74, 74);

//Borde de la barra de exp
ctx.fillStyle = "#756e6d"
ctx.lineWidth = 0.2
ctx.strokeRect(143,32,212,15)

ctx.lineWidth = 1

//Fondo de la barra de exp
ctx.fillStyle = "#fff"
ctx.fillRect(145,34,208,11)

//Barra de exp
ctx.fillStyle = filas.accent
let x = filas.exp
ctx.fillRect(145,34,Math.round((x*208/xpNecesaria)),11)

//EXP encima de la barra de EXP
ctx.font = "10px Texta"
ctx.fillStyle = filas.accent
ctx.textAlign='center'
ctx.fillText(`XP: ${filas.exp} / ${xpNecesaria}`, 250, 43)

//Linea divisora
ctx.fillStyle = rank.accent
ctx.lineWidth = 0.5
ctx.moveTo(218,52)
ctx.lineTo(218,96)
ctx.stroke()

ctx.lineWidth = 1

//Tag del usuario
ctx.font = "13px Aspira"
ctx.fillStyle = "#606060"
ctx.textAlign='left'
ctx.fillText(usuario.tag, 143, 25);

//"Server Exp"
ctx.font = "15px Texta"
ctx.fillStyle = "#606060"
ctx.textAlign='left'
ctx.fillText("Server Exp:", 227, 80)

//El Exp
ctx.font = "15px Texta"
ctx.fillStyle = "#606060"
ctx.textAlign='right'
ctx.fillText(filas.exp, 354, 80)

//"Level"
ctx.font = "17px Texta"
ctx.fillStyle = "#606060"
ctx.textAlign='left'
ctx.fillText("LEVEL", 155, 66)

//El nivel actual
ctx.font = "bold 35px Texta" 
ctx.fillStyle = "#606060"
ctx.textAlign='center'
ctx.fillText(filas.nivel, 179, 94)  

//en discord.js 11 se llama Attachment
let attachment = new Discord.MessageAttachment(canvas.toBuffer(),"profile.png")
message.channel.send(attachment)
    
 
  
 });
 
    
    
  }
} 