//Usando módulos de ES6. Usa commons.js si por alguna razón necesitas __dirname o require
//Ejemplo en utils/registry.js

//import.meta.url aunque da error en el editor, no lo da en Node.

//Para importar usas import algo from 'modulo' Archivos locales necesitan su extensión

//Exportas con export const algo = <cosa> o export default <cosa>

//Si necesitas que un archivo funcione a fuerzas a la antigua, pones de extensión `.cjs`

//WEB

import express from "express";
const app = express();
import http from "http"
import path from "path"
import morgan from "morgan"
import passport from "passport"
import bodyParser from "body-parser"
import session from "express-session"
import Strategy from 'passport-discord'
import YouTubeNotifier from 'youtube-notification';
import giveaway from "discord-giveaways";
import quick from "quick.db"
import ms from "ms"
  import config from './config/bot.json';
passport.serializeUser((user, done) => {
  done(null, user);
});  

passport.deserializeUser((obj, done) => {
  done(null, obj);
});
let __dirname = path.resolve();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));

let scopes = ["identify", "guilds"];
let prompt = "consent";



passport.use(new Strategy({
    clientID: "760221562833731665",
    clientSecret: process.env.SECRET,
    callbackURL:  `http://worried-adhesive-wallflower.glitch.me/auth/callback`,
    scope: scopes,
    prompt: prompt
}, (accessToken, refreshToken, profile, done) => {
    process.nextTick(() => {
        return done(null, profile);
    });
}));

app.use(session({
      secret: process.env.SECRET,
      cookie: {
        maxAge: 60000 * 60 * 24
      },
      saveUninitialized: false,
      resave: false,
      name: "discord.oauth2"
}));

app.use(express.urlencoded({
  extended: true
}))

app.use(passport.initialize());
app.use(passport.session());
app.get("/auth/login", passport.authenticate("discord", { scope: scopes, prompt: prompt }), (req, res) => {});
app.get("/auth/callback",
    passport.authenticate("discord", {
    	failureRedirect: "/"
    }), (req, res) => {
    	res.redirect("/")
    }
);

app.get("/auth/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});


app.get("/", (req, res, profile) => {
  
  if(req.user){
    let datoServidores = req.user.guilds.filter(p => (p.permissions & 2146958591) === 2146958591);
res.redirect("/server")
  } else {
res.redirect("/auth/login")
  }
});


app.get("/server",  async (req, res, profile) => {
  
  if(req.user){
    

    let datoServer = req.user.guilds.filter(p => (p.permissions & 2146958591) === 2146958591);



    res.render("dashboard", {
      logged: true,
      username: `${req.user.username}`,
      tag: `${req.user.discriminator}`,
      datoServer: datoServer,
      avatar: `https://cdn.discordapp.com/avatars/${req.user.id}/${req.user.avatar}.${req.user.avatar.startsWith('a_') ? "gif" : "png"}?size=2048`
    });
  } else {
    res.redirect("/")
  }
});


app.get("/server/:id",  async (req, res, profile) => {
  let id = req.params.id
  if(req.user){
let server = client.guilds.cache.get(id)
if(!server) return res.redirect("/server")
    res.render("server", {
      logged: true,
      username: `${req.user.username}`,
      server: server,
      client: client,
       guild: server,
      tag: `${req.user.discriminator}`,
      avatar: `https://cdn.discordapp.com/avatars/${req.user.id}/${req.user.avatar}.${req.user.avatar.startsWith('a_') ? "gif" : "png"}?size=2048`
    });
  } else {
    res.redirect("/")
  }
});

app.post('/:id/giveaway-create', (req, res) => {

  const id = req.params.id
  const channel = req.body.canal
    const tiempo = req.body.tiempo
  const premio = req.body.premio
  const ganadores = req.body.ganadores
  const type = req.body.type

    let server = client.guilds.cache.get(id)
  let bot = server.members.cache.get(client.user.id)
let channe = client.channels.cache.get(channel)
  client.giveawaysManager.start(channe, {
            time: ms(tiempo + type),
            prize: premio,
            winnerCount: parseInt(ganadores)
        })
  
  res.redirect(`/server/${id}`)
})

app.post('/:id/mod-cmd', (req, res) => {
  const estado = req.body.mod
  const id = req.params.id
  const db = new quick.table("moderation");
  console.log(`Mod status set to ${estado}`)
    let server = client.guilds.cache.get(id)

if(estado === "on"){
       db.delete(`mod_status_${id}`)
} else if(estado == "off"){
   db.set(`mod_status_${id}`, true)
}
  
  res.redirect(`/server/${id}`)
})

app.post('/:id/change-nickname', (req, res) => {
  const id = req.params.id
  const username = req.body.nickname
  console.log(`${id} + ${username}`)
    let server = client.guilds.cache.get(id)
  let member = server.members.cache.get(client.user.id)
  member.setNickname(username);
  
  res.redirect(`/server/${id}`)
})

app.post('/:id/logs-channel', (req, res) => {
let db = quick
  const id = req.params.id
  const channel = req.body.canal
   
  db.set(`logs_${id}`, channel);
  res.redirect(`/server/${id}`)
})

app.post('/:id/report-channel', async (req, res) => {
const db = new quick.table("report_echannel");
  const id = req.params.id
  const channel = req.body.canal
   console.log(`${channel} has been marked as report channel`)
db.set(`reportChannel_${id}`, channel);
  res.redirect(`/server/${id}`)
})


app.post('/:id/unlock-channel', async (req, res) => {
  const id = req.params.id
  const channel = req.body.canal
  const canal = client.channels.cache.get(channel)
  console.log(canal)
      canal.updateOverwrite(canal.guild.roles.everyone, { 
                    SEND_MESSAGES: true
                })
    await canal.setName(canal.name.replace(/\s*🔒/, ''))
   console.log(`${channel} has been unlocked`)
  res.redirect(`/server/${id}`)
})

app.post('/:id/lock-channel', async (req, res) => {
  const id = req.params.id
  const channel = req.body.canal
    const canal = client.channels.cache.get(channel)
    console.log(canal)
    canal.updateOverwrite(canal.guild.roles.everyone, { 
                    SEND_MESSAGES: false
                })
    await canal.setName(canal.name += `🔒`)
   console.log(`${channel} has been locked`)
  res.redirect(`/server/${id}`)
})

app.post('/:id/poll-channel', async (req, res) => {
  const id = req.params.id
  const channel = req.body.canal
  const text = req.body.titulo
    const canal = client.channels.cache.get(channel)
      const msg = await canal.send(`**${await req.user.username}** pregunta: ${text}`);
      await msg.react("👍")
      await msg.react("👎")
   console.log(`${channel} poll created`)
  res.redirect(`/server/${id}`)
})

app.post('/:id/add-prefix', async (req, res) => {
  const id = req.params.id

  const guild = client.guilds.cache.get(id)
  const texto = req.body.prefix
  const defaultPrefix = config.prefix;
const db = new quick.table("prefix");
          const prefixes = await db.fetch(guild.id);
        if(!prefixes) {
          db.set(guild.id, [defaultPrefix], texto);
        } else {
          db.push(guild.id, texto);
        }
  res.redirect(`/server/${id}`)
})

app.post('/:id/ticket-channel', async (req, res) => {
  const ticketDB = new quick.table("ticket");
  const id = req.params.id
  const channel = req.body.canal
  const text = req.body.titulo
  const text2 = req.body.titulo2
  const role = req.body.role
  const category = req.body.categoria
  console.log(req.body)
    const canal = client.channels.cache.get(channel)
    let datasos = []
    datasos.push(role)
console.log(`ROLE OD: ${role} CATEGORIA ID: ${category} CHANNEL ID: ${channel} TEXT: ${text}`)
  const embed = new Discord.MessageEmbed();
    embed.setTitle(text)
  embed.setDescription("Para crear un ticket, reacciona con: 📩")
  const msg = await canal.send(embed)
  await msg.react("📩");
  ticketDB.push(`${canal.guild.id}.panels`, {
      messageID: msg.id,
      guildID: msg.guild.id,
      channelID: channel.id,
      roles: datasos,
      panelName: text,
      tickets: [],
      parentID: category,
      description_tickets: text2,
      tickets_lenght: 1
  });
    
  res.redirect(`/server/${id}`)
})

const listener = app.listen(process.env.PORT, function () {
  console.log("Escuchando al puerto " + listener.address().port);
})



/*
const notifier = new YouTubeNotifier({
  hubCallback: 'https://candied-skitter-ethernet.glitch.me/yt',
  secret: 'JOIN_MY_SERVER_OR_DIE'
});
notifier.on('notified', data => {
  console.log('New Video');
});
notifier.subscribe(["UCOwTYbL3H7VCz4-R89UZGWg"]);
app.use("/yt", notifier.listener());
*/















//BOT

import Discord from 'discord.js';
import ejs from 'ejs'




//Command y event handler
import { registerCommands, registerEvents } from './utils/registry.js';
const client = new Discord.Client({ disableMentions: "everyone" , partials: ['MESSAGE', 'CHANNEL', 'REACTION'], ws: { intents: 32767 } });
client.commands = new Discord.Collection();
client.errorURL = "https://cdn.discordapp.com/emojis/672294241174683649.gif";
client.queue = new Map();
client.vote = new Map();
const manager = new giveaway.GiveawaysManager(client, {
    updateCountdownEvery: 10000,
    default: {
        botsCanWin: false,
        exemptPermissions: [],
        embedColor: "#FF0000",
        reaction: "🎉"
    }
});
client.giveawaysManager = manager;
(async () => {
  await registerEvents(client, "../eventos");
  await registerCommands(client, "../comandos");
  //process.env.DISCORD_TOKEN
  await client.login();
})().catch(err => {
  console.error(err);
  process.exit(1);
});

process.on("unhandledRejection", e => {
  console.error("Denegación de promesa no manejada:", e);
});

process.on("uncaughtException", e => {
  client.destroy();
  console.error("Excepción sin capturar. Cerrando la app...", e);
  process.exit(1);
})
