import Discord from 'discord.js';
import Command from '../utils/comando.js';
import d from '../config/definiciones.json';
const definiciones = new Discord.Collection(Object.entries(d));

export default class extends Command {
  constructor(options){
    super(options)
    this.usage = "help [comando]";
    this.description = "Muestra los comandos que tiene el bot y si le pones uno te mostrará las características del mismo";
  }
  async run(message, args){
    const comando = this.client.commands.get(args[0]);
    if(comando) {
      if(comando.owner) return message.channel.send("Ese comando es privado!");
      if(!comando.enabled) return message.channel.send("Ese comando actualmente está deshabilitado");
      const embed = new Discord.MessageEmbed()
      .setColor("#FFD")
      .setTitle("Ayuda -> " + comando.name)
      .addField("Categoría", definiciones.get(comando.category) ? definiciones.get(comando.category).name : "Sin categorizar")
      .addField("Alias", comando.aliases.join(", ") || "Ninguno")
      .addField("Uso", comando.usage || "?")
      .addField("Descripción", comando.description || "?")
      .addField("Permisos necesarios", `Usuario: \`${!(new Discord.Permissions(comando.userPerms[0]).has(8)) ? (new Discord.Permissions(comando.userPerms[0]).toArray().join(", ") || "Ninguno") : "ADMINISTRATOR"}\`\nBot: \`${!(new Discord.Permissions(comando.botPerms[0]).has(8)) ? (new Discord.Permissions(comando.botPerms[0]).toArray().join(", ") || "Ninguno") : "ADMINISTRATOR"}\``)
        .addField("Permisos necesarios (canal)", `Usuario: \`${!(new Discord.Permissions(comando.userPerms[1]).has(8)) ? (new Discord.Permissions(comando.userPerms[1]).toArray().join(", ") || "Ninguno") : "ADMINISTRATOR"}\`\nBot: \`${!(new Discord.Permissions(comando.botPerms[1]).has(8)) ? (new Discord.Permissions(comando.botPerms[1]).toArray().join(", ") || "Ninguno") : "ADMINISTRATOR"}\``)
      .addField("Se puede usar en", comando.guildonly ? "Servidor" : "Servidor y MDs")
      .setFooter('Pedido por: ' + message.author.tag, message.author.displayAvatarURL({ dynamic: true }));
      message.channel.send(embed);
    } else if(!args[0]) {
      const embed = new Discord.MessageEmbed()
      .setTitle("Ayuda")
      .setDescription("Aqui encontrarás todos los comandos que el bot puede ofrecer\npuedes usar `help [comando]` para recibir ayuda de un comando específico")
      .setFooter('Pedido por: ' + message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
      .setColor("RANDOM");
      for(const categoria of definiciones.filter(e => !e.hide)) {
        const comandos = this.client.commands.filter(e => (e.category === categoria[0]) && !e.owner && e.enabled);
        if(!comandos.size) continue;
        const lista = comandos.map(e => `\`${e.name}\``);
        embed.addField(categoria[1].name || "?", `${categoria[1].description}\n${lista.join(", ")}` || "?");
      }
      message.channel.send(embed);
    } else {
      message.channel.send("No existe ese comando");
    }
  }
} 