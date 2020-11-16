import path from "path";
import fs from "fs";
import commons from "./commons.js";
//IMPORTANTE: Remplazar por la propiedad "import.meta.url" cuando se esté listo para producción.
//Culpale al Glitch
const { __dirname } = commons("file:///app/utils/registry.js");

export async function registerCommands(client, dir) {
  const arr = dir.split("/");
  const category = arr[arr.length - 1];
  let files = fs.readdirSync(path.join(__dirname, dir));
  for (let file of files) {
    let stat = fs.lstatSync(path.join(__dirname, dir, file));
    if (stat.isDirectory())
      // If file is a directory, recursive call recurDir
      registerCommands(client, path.join(dir, file));
    else {
      // Check if file is a .js file.
      if (file.endsWith(".js")) {
        let cmdName = file.substring(0, file.indexOf(".js"));
        try {
          let cmdThing = await import(path.join(__dirname, dir, file));
          let cmdClass = cmdThing.default;
          
          let cmdModule = new cmdClass({ name: cmdName, category, client });
          client.commands.set(cmdName, cmdModule);
        } catch (err) {
          console.error(
            "There was an error initializing the " + cmdName + " command\n",
            err
          );
          client.commands.set(cmdName, {
            run: async (bot, message, args) =>
              message.channel.send(
                "That command is not loaded due to error: " + err
              ),
            description: "That command is not loaded due to error",
            aliases: []
          });
        }
      }
    }
  }
}

export async function registerEvents(client, dir) {
  let files = fs.readdirSync(path.join(__dirname, dir));
  // Loop through each file.
  for (let file of files) {
    let stat = fs.lstatSync(path.join(__dirname, dir, file));
    if (stat.isDirectory())
      // If file is a directory, recursive call recurDir
      registerEvents(client, path.join(dir, file));
    else {
      // Check if file is a .js file.
      if (file.endsWith(".js")) {
        let eventName = file.substring(0, file.indexOf(".js"));
        try {
          let eventAlgo = await import(path.join(__dirname, dir, file));
          let eventModule = eventAlgo.default;
          client.on(eventName, eventModule.bind(null, client));
        } catch (err) {
          console.error("There was an error initializing the " + eventName + " event\n", err);
        }
      }
    }
  }
}