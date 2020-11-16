import Discord from "discord.js";
import config from "../../config/bot.json";
import quick from "quick.db";
const db = new quick.table("prefix");
const defaultPrefix = config.prefix;
const modDB = new quick.table("moderation");
import sqlite3 from "sqlite3";
sqlite3.verbose();
const db2 = new quick.table("mute_role");
const dbhl = new quick.table("highlights");
const sdb = new sqlite3.Database("./db/niveles.sqlite");
  
export default async function(client, message) {
  if (message.author.bot) return;
  if (message.channel.type === "dm" && message.content === "hola"){
    const embed = new Discord.MessageEmbed()
    .setAuthor("Hola")
    message.channel.send(embed)
  }
    if (message.channel.type === "dm") return;
const modStatus = await modDB.fetch(`mod_status_${message.guild.id}`)
 const hl = dbhl.fetch(message.guild.id)
   if(hl && hl.feeds && hl.feeds.length && hl.feeds.find(a =>  message.content.includes(a.title))){
  let usuario = hl.feeds.find(a => message.content.includes(a.title))
  if(usuario.user === message.author.id) return 
     const embed = new Discord.MessageEmbed()
     .setAuthor("Nuevo highlight")
     .setColor("RANDOM")
     .setDescription("**"+message.author.username+": **" + message.content + `\n\n [Ir al mensaje](https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id})`)
     client.users.resolve(usuario.user).send(embed)
     } 
     
      if(!message.member.hasPermission("MANAGE_MESSAGES") && message.content.match(Discord.MessageMentions.USERS_PATTERN) && message.content.match(Discord.MessageMentions.USERS_PATTERN).length > 6 ){
      const channel_db = await quick.fetch(`logs_${message.guild.id}`)
  const canaleee = client.channels.cache.get(channel_db)
        const embed = new Discord.MessageEmbed()
    embed.setAuthor("Drama Channel")
    embed.setColor("RED")
    embed.setDescription(`Un usuario ha incumplido la reglas`)
    const msg = await canaleee.send(embed)
    await msg.react("🔨")
    await msg.react("🔇")
    await msg.react("👢")
    await msg.react("🗑")
    await msg.react("❌")
   await msg.awaitReactions(async (reaction, user) => {
    const muterole = await db2.fetch(`muterole_${message.guild.id}`);
     if (client.user.id === user.id) return;
     if (reaction.emoji.name === "🔨") {
       message.member.ban({reason: "Por un mod"})
     }
    if (reaction.emoji.name === "🔇") {
       message.member.roles.add(muterole)
     }
    if (reaction.emoji.name === "👢") {
       message.member.kick("por un mod")
     }
    if (reaction.emoji.name === "🗑") {
       message.delete()
    }
    if (reaction.emoji.name === "❌") {
       msg.delete()
    }
   })
      
    }
    const links = ["https://discord.gg/","discord.gg/","discord.gg", "https://discord.com/invite"]
  if(!message.member.hasPermission("MANAGE_MESSAGES") && message.content.match(/(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discordapp\.com\/invite)\/.+[a-z]/g)) {
  await message.delete()
  return message.channel.send(`:x: **|**${message.author} No puedes enviar esos links aqui!`)
          const channel_db = await quick.fetch(`logs_${message.guild.id}`)
  const canaleee = client.channels.cache.get(channel_db)
        const embed = new Discord.MessageEmbed()
    embed.setAuthor("Drama Channel")
    embed.setColor("RED")
    embed.setDescription(`Un usuario ha incumplido la reglas`)
    const msg = await canaleee.send(embed)
    await msg.react("🔨")
    await msg.react("🔇")
    await msg.react("👢")
    await msg.react("🗑")
    await msg.react("❌")
   await msg.awaitReactions(async (reaction, user) => {
    const muterole = await db2.fetch(`muterole_${message.guild.id}`);
     if (client.user.id === user.id) return;
     if (reaction.emoji.name === "🔨") {
       message.member.ban({reason: "Por un mod"})
     }
    if (reaction.emoji.name === "🔇") {
       message.member.roles.add(muterole)
     }
    if (reaction.emoji.name === "👢") {
       message.member.kick("por un mod")
     }
    if (reaction.emoji.name === "🗑") {
       message.delete()
    }
    if (reaction.emoji.name === "❌") {
       msg.delete()
    }
   })
      }
  if(!!message.guild.me.hasPermission("MANAGE_MESSAGES") && message.content.match(Discord.MessageMentions.USERS_PATTERN) && message.content.match(Discord.MessageMentions.USERS_PATTERN).length > 6 ){
    let warns = db.fetch(`warnings_${message.guild.id}_${message.author.id}`)
    const embed = new Discord.MessageEmbed()
    .setAuthor("Warn")
    .setColor("RED")
    .setDescription(`Has recibido una warn por spam de menciones`)
    .setFooter(`${warns + 1}/3`)
    message.reply(embed)
let target = message.member
        let warning = db.fetch(`warnings_${message.guild.id}_${target.id}`)
  if(warning > 2){
    target.ban({reason: "Por acomular 3 warnings"}).catch(() => {})//lo pruevo? 
    db.set(`warnings_${message.guild.id}_${target.id}`, 0)

  }
  if(warning === null){
    db.set(`warnings_${message.guild.id}_${target.id}`, 1)

  };
  if(warning !== null){
    db.add(`warnings_${message.guild.id}_${target.id}`, 1)
  }
  }

      
      
  
  //Cosas que no son comandos

  //Sistema de niveles
  
  
 
  
  

  let SQLCreate = `CREATE TABLE IF NOT EXISTS userLvl (id TEXT, nivel INTEGER, exp INTEGER, accent TEXT, bg TEXT, opacity INTEGER, color TEXT)`;

  sdb.run(SQLCreate, function(err) {
    if (err) return console.error(err.message);
  });
  
  

  let SQLSelect = `SELECT * FROM userLvl WHERE id = '${message.author.id}'`;

  sdb.get(SQLSelect, (err, filas) => {
    
       const bdb = new quick.table("levelblacklist");
  let blackUser = bdb.fetch(`blacklist_${message.author.id}`)
  let blackChannel = bdb.fetch(`blacklist_${message.channel.id}`)
  
  if(blackUser == true) return 
  if(blackChannel == true) return
    
    if (err) return console.error(err.message);
    if (!filas) {
      let SQLInsert = `INSERT INTO userLvl(id, nivel, exp, accent, bg, opacity, color) VALUES('${message.author.id}', 0, 1, '#f4424b', 'https://i.imgur.com/80oy1Z9.jpg', '0.7', '#ffffff')`;

      sdb.run(SQLInsert, function(err) {
        if (err) return console.error(err.message);
      });
    } else {
      let xpNecesaria = 50 + filas.nivel * 10
      let curLevel = Math.floor(0.1 * Math.sqrt(filas.exp + 1));

      if (filas.exp > xpNecesaria) {
        let update = `UPDATE userLvl SET exp = 0, nivel = ${filas.nivel + 1} WHERE id = ${message.author.id}`;

        sdb.run(update, function(err) {
          if (err) return console.error(err.message);
          let mensajito = message.channel.send(`**__Has subido de nivel__** \n ${message.author} ahora eres nivel **${filas.nivel + 1}**`)
                    if (err) return console.error(err.message);
          });
      } else {
        
        
              let update = `UPDATE userLvl SET exp = ${filas.exp + 1} WHERE id = ${message.author.id}`;
      
    
      sdb.run(update, function(err) {
        if (err) return console.error(err.message);
      });
        
      }


    }
  });


  let prefixes = await db.fetch(message.guild.id);
  if (!prefixes) prefixes = [defaultPrefix];
  let prefix;
  for (const pre of prefixes) {
    if (message.content.startsWith(pre)) {
      prefix = pre;
    }
  }
  if (!prefix) return;
  
  

  
  //Comandos
  //Argumentos
  const args = message.content
    .substring(prefix.length)
    .trim()
    .split(/ +/g);
  //Sacar el nombre del comando de los argumentos
  const commandName = args.shift();
    const command =
    client.commands.get(commandName) ||
    client.commands.find(e => e.aliases.includes(commandName));
  if(!command) return;
  let categoria = command.category 
  
      const ModDisabled = new Discord.MessageEmbed()
   .setAuthor("Los comandos de mod estan desabilitados en este servidor", client.errorURL)
    .setColor("RED")
    if(categoria == "mod" && modStatus === true) return message.channel.send(ModDisabled)
    
  
  //Obtener el comando

  if (command) {
    //Checks
    if (command.disabled) return message.channel.send("Comando deshabilitado");

    if (
      message.guild &&
      !message.channel
        .permissionsFor(client.user)
        .has(["VIEW_CHANNEL", "SEND_MESSAGES"])
    )
      return;

    if (!message.guild && command.guildonly)
      return message.channel.send("Este comando sólo funciona en servidores");

    if (command.owner && !config.devs.includes(message.author.id))
      return message.channel.send("No puedes ejecutar este comando");

    if (message.guild) {
      //Revisar los permisos
      const userperms = message.member.permissions;

      const userchannelperms = message.channel.permissionsFor(message.member);

      const botperms = message.guild.me.permissions;

      const botchannelperms = message.channel.permissionsFor(message.guild.me);

      //Condiciones ternarias para diferenciar 8 o ADMINISTRADOR
      //Los permisos del usuario no se checan en los desarrolladores
      if (!config.devs.includes(message.author.id)) {
        if (!userperms.has(command.userPerms[0]))
          return message.channel.send(
            "No tienes los permisos suficientes para ejecutar este comando.\nPermisos necesarios:\n`" +
              (!new Discord.Permissions(command.userPerms[0]).has(8)
                ? new Discord.Permissions(command.userPerms[0])
                    .toArray()
                    .join(", ") || "None"
                : "ADMINISTRATOR") +
              "`"
          );
        if (!userchannelperms.has(command.userPerms[1]))
          return message.channel.send(
            "No tienes los permisos suficientes para ejecutar este comando **en este canal**.\nPermisos necesarios:\n`" +
              (!new Discord.Permissions(command.userPerms[1]).has(8)
                ? new Discord.Permissions(command.userPerms[1])
                    .toArray()
                    .join(", ") || "None"
                : "ADMINISTRATOR") +
              "`"
          );
      }
      //Permisos del bot
     if (!botperms.has(command.botPerms[0]))
        return message.channel.send(
          "Perdón, no tengo suficientes permisos para ejecutar este comando.\nPermisos necesarios:\n`" +
            (!new Discord.Permissions(command.botPerms[0]).has(8)
              ? new Discord.Permissions(command.botPerms[0])
                  .toArray()
                  .join(", ") || "None"
              : "ADMINISTRATOR") +
            "`"
        );
      if (!botchannelperms.has(command.botPerms[1]))
        return message.channel.send(
          "Perdón, no tengo suficientes permisos para ejecutar este comando **en este canal**.\nPermisos necesarios:\n`" +
            (!new Discord.Permissions(command.botPerms[1]).has(8)
              ? new Discord.Permissions(command.botPerms[1])
                  .toArray()
                  .join(", ") || "None"
              : "ADMINISTRATOR") +
            "`"
        );
    }


    //Ejecutar el comando
    command
      .run(message, args)
      .catch(err => {
        //Cualquier error aquí
        console.log(err);
        message.channel.send("Error: " + err);
      })
      .finally(() => {
        //Por si alguien lo usa
        message.channel.stopTyping(true);
      });
  }
}