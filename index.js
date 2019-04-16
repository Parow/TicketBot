// Load up the discord.js library
const {
  Client,
  Attachment,
  RichEmbed
} = require('discord.js');
const client = new Client();
const config = require("./config.json");

client.on("ready", () => {
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
  client.user.setActivity(`Une question ? MP MOI`);
});

client.on("guildCreate", guild => {
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

client.on("guildDelete", guild => {
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
});

function SendMessageTicket(message) {
  console.log(config.serverID)
  var server = client.guilds.get(config.serverID);
  c = server.channels.find("name", "ticket-" + message.author.id)
  var Attachment = (message.attachments).array();
  if (Attachment[0] !== undefined) {
      var pp = Attachment[0].url;
  } else {
      var pp = "";
  }

  const embed = new RichEmbed()
      .setColor(0xCF40FA)
      .addField(`Nouveau message de ${message.author.username}`, message.content + " " + pp)
      .setTimestamp();
  c.send({
      embed: embed
  });
}
client.on("message", async message => {
  var server = client.guilds.get(config.serverID);
  if (message.author.bot) return;
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  if (message.channel.type !== "dm") {
      if (message.channel.name.indexOf('ticket') > -1 && command != "close") {
          var ret = message.channel.name.replace('ticket-', '');

          console.log(ret)
          var pq = client.users.get(ret)
          const embed = new RichEmbed()
              .setColor(0xCF40FA)
              .addField(`Nouveau message de ${message.author.username}`, message.content)
              .setTimestamp();
          pq.send({
              embed: embed
          });

      } else {
          if (command == "close" && message.channel.name.indexOf('ticket') > -1) {
              var ret = message.channel.name.replace('ticket-', '');

              console.log(ret)
              var pq = client.users.get(ret)
              const embed = new RichEmbed()
                  .setColor(0xCF40FA)
                  .addField(`Nouveau message`, "Votre demande a été fermé inutile de répondre à ce message")
                  .setTimestamp();
              pq.send({
                  embed: embed
              });

              message.channel.delete()
          }
      }
  }
  if (message.channel.type === "dm") {
    console.log(message.author.id)
      
      console.log(server.channels.exists("name", "ticket-" + message.author.id))
      if (server.channels.exists("name", "ticket-" + message.author.id)) return SendMessageTicket(message);
      server.createChannel(`ticket-${message.author.id}`, "text").then(c => {
        console.log(config.ModeratorRoles[1])
          for (i = 0; i < config.ModeratorRoles.length; i++) {
            //console.log(config.ModeratorRoles[i])
              var role1 = client.guilds.get(config.serverID).roles.find("name", config.ModeratorRoles[i]);
              c.overwritePermissions(role1, {
                  SEND_MESSAGES: true,
                  READ_MESSAGES: true
              });
          }
          let role2 = client.guilds.get(config.serverID).roles.find("name", "@everyone");
          console.log(role2.id)
          c.overwritePermissions(role2, {
              SEND_MESSAGES: false,
              READ_MESSAGES: false
          });
          message.channel.send(`:white_check_mark: Votre demande a été transmit au staff.`);
          const embed = new RichEmbed()
              .setColor(0xCF40FA)
              .addField(`Nouveau ticket de ${message.author.username}#${message.author.discriminator}`, message.content)
              .setTimestamp();
          c.send({
              embed: embed
          });

      }).catch(console.error); // Send errors to console
  }
});

client.login(config.token);