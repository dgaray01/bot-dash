import Command from '../../utils/comando.js';
import Discord from 'discord.js';
import config from '../../config/bot.json';
import util from 'util';
import db from 'quick.db'
import commons from '../../utils/commons.js';
const { require, __dirname, __filename } = commons("file:///app/comandos/owner/eval.js");
import fs from 'fs'
import sqlite3 from "sqlite3";
sqlite3.verbose();

const nivelesDB = new sqlite3.Database("./db/niveles.sqlite");


//Importas cosas aquí para que funcionen en el eval
export default class extends Command {
  constructor(options) {
    super(options)
    this.owner = true;
    this.description = "Evalua códigos con eval()";
    this.usage = "eval <evaluar>\n\nEs el eval de siempre. Usa await import() para importar un módulo de ES6 y require() para lo demás";
  }
  async run(message, args) {
    //Facilitar el mostrar como se usa cada comando, si ese es el caso
    if (!args[0]) return this.showUsage(message.channel);
    try {
      let evaluated = await eval(args.join(" "));
      if (typeof evaluated !== "string") evaluated = util.inspect(evaluated, { depth: 0 });
      const arr = Discord.Util.splitMessage(evaluated, { maxLength: 1950 });
      message.channel.send(arr[0], { code: "js" })
    } catch (err) {
      const arr = Discord.Util.splitMessage(err.toString(), { maxLength: 1950 });
      message.channel.send("```js\n" + arr[0] + "```");
    }
  }
}