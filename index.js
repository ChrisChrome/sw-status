const config = require("./config.json");
const Discord = require("discord.js");
const converter = require("hex2dec");
const express = require('express');
const app = express();
const hook_url = config.discord.webook_url.split("/");
const hook = new Discord.WebhookClient({
	"id": hook_url[5],
	"token": hook_url[6]
})

var msg = null

const colors = {
	"normal": parseInt(converter.hexToDec(config.stormworks.color_norm.replace("#", ""))),
	"warn": parseInt(converter.hexToDec(config.stormworks.color_warn.replace("#", ""))),
	"offline": parseInt(converter.hexToDec(config.stormworks.color_offl.replace("#", "")))
}

hook.on("rateLimit", () => {
	console.log("I'm being rate limited!!!");
})
var limit = false
hook.fetchMessage(config.discord.message_id).then((msg1) => {
	msg = msg1
	app.listen(config.stormworks.web_port, () => {
		console.log('server started');
		hook.editMessage(msg, {
			embeds: [{
				"title": config.stormworks.server_name,
				"color": colors.warn,
				"description": "<:idle:702707385923534899> 	Waiting for data"
			}]
		})
	});
	var onlinecheck = null
	app.get("/data", (req, res) => {
		if(limit) return res.sendStatus(429).end();
		limit = true
		setTimeout(() => {
			limit = false
		}, 5000);
		clearInterval(onlinecheck);
		onlinecheck = setTimeout(() => {
			hook.editMessage(msg, hook.editMessage(msg, {
				embeds: [{
					"title": config.stormworks.server_name,
					"color": colors.offline,
					"description": "<:dnd:702706836637351966> Server Offline"
				}]
			}))
			playercount = -1
		}, 10000);
		if (!req.query.playercount || !req.query.tps) {
			res.sendStatus(400).end();
		}
		hook.editMessage(msg, hook.editMessage(msg, {
			embeds: [{
				"title": config.stormworks.server_name,
				"description": req.query.tps<=config.stormworks.tps_warn_level?"<:idle:702707385923534899> TPS Low":"<:online:702707399240187924> Server Online",
				"color": req.query.tps<=config.stormworks.tps_warn_level?colors.warn:colors.normal,
				"fields": [
					{
						"name": "Players",
						"value": `${req.query.playercount}/${config.stormworks.max_players}`,
						"inline": true
					},
					{
						"name": "TPS (Server FPS)",
						"value": req.query.tps.toString()
					}
				]
			}]
		})).then(() => {
			res.sendStatus(200).end();
		})
	})

}).catch((err) => {
	if (err.toString() == "DiscordAPIError: 404: Not Found") {
		hook.send({
			embeds: [{
				description: "I couldn't find the message I'm configured to use, This error message can be used though!"
			}]
		}).then((msg1) => {
			hook.editMessage(msg1, {
				embeds: [{
					description: `I couldn't find the message I'm configured to use, This error message can be used though!\nThe ID of this message is \`${msg1.id}\``
				}]
			})
		})
	} else {
		hook.editMessage(msg, {
			embeds: [{
				"title": "Fatal error occured",
				"color": colors.warn,
				"description": `The following error occured, please report it to <@289884287765839882> (Chris Chrome#9158)\n\n\`\`\`\n${err.toString()}\`\`\``
			}]
		})
	}
})