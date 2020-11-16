//La clase que se usara en todos los comandos. Todos los comandos deben extender esto.
import Discord from 'discord.js';
export default class Command {
  constructor(options) {
    //Checks
    if(typeof options !== "object") throw new Error("'options' must be an object");
    if(typeof options.name !== "string") throw new Error("'options.name' must be a string");
    if(typeof options.category !== "string") throw new Error("'options.category' must be a string");
    if(!(options.client instanceof Discord.Client)) throw new Error("'options.client' must be an instance of a Discord.js Client");
    
    //Opciones core definidas automáticamente
    this.name = options.name;
    this.category = options.category;
    this.client = options.client;
    //Todas las opciones que se pueden establecer en los comandos extendidos
    //Comando habilitado globalmente
    this.enabled = true;
    //Alias
    this.aliases = [];
    //Los permisos pueden ser obtenidos evaluando `Discord.Permissions.FLAGS`
    //Permisos de usuario. Los desarrolladores saltan los permisos establecidos aquí
    this.userPerms = [0, 0];
    //Permisos del bot
    this.botPerms = [0, 0];
    //Sólo servidor, no DMs
    this.guildonly = false;
    //Sólo desarrolladores
    this.owner = false;
    //Uso de un comando
    this.usage = `${this.name} <algo>`;
    //Descripción de un comando
    this.description = "Descripción por defecto, modificar en la clase extendida";
  }
  
  //Todos los comandos deberían devolver una promesa para que funcionen de forma correcta en el evento message!
  async run(message, args) {
    console.log(this.name, this.category);
  }
  
  showUsage(channel) {
    return channel.send("Uso del comando\n`" + this.usage + "`");
  }
  
  delete() {
    this.client.commands.delete(this.name);
  }
}