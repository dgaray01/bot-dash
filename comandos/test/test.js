import Command from '../../utils/comando.js';
export default class extends Command {
  constructor(options) {
    super(options);
    //Incluir siempre el super
    //Las opciones están en comando.js
    this.aliases = ["aaaa"];
    this.userPerms = [8, 0];
    this.botPerms = [8, 0];
    this.usage = "ssssssssssssssssssssssssssssssssssssssssssssssss";
    this.description = "Comando para probar la clase extendida";
  }
  
  //Todos los comandos deberían devolver una promesa para que funcionen de forma correcta en el evento message!
  async run(message, args) {
    this.showUsage(message.channel);
    message.channel.send("Hola");
  }
}