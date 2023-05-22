/* ---- JAVASCRIPT VERSION -----
-                              -
-        REACT.JS CHAT         -
-       CREDITS: Adrian_       -
-                              -
- ---- JAVASCRIPT VERSION -----*/

/* --- IMPORT SECTION --- */
const alt = require("alt-server");

/* --- VARIABLES --- */
const hexColorPattern = /\{[0-9a-fA-F]{6}\}/;

/* --- EVENTS --- */
alt.onClient('chat::send_chat_message', (player, message) => {
    const processedMessage = message.replace(hexColorPattern, '');
    const nearPlayers = alt.Player.all.filter((p) => p.pos.distanceTo(player.pos) < 20);
    alt.emitClient(nearPlayers, 'chat::send_chat_messages', `${player.name}: ${processedMessage}`);
});
alt.onClient('chat::execute_server_command', (player, message) => {
    let args = message.split(' ');
    let cmd = args.shift();

    if (CommandHandler.handlers[cmd]) {
        CommandHandler.handlers[cmd](player, args);
    } else {
        sendError(player, `This command does not exist. Type the command /help for information.`);
    }
});

/* --- FUNCTIONS --- */
function sendMessage(player, color, message) {
    alt.emitClient(player, "chat::send_chat_messages", `{${color}}${message}`);
}
function sendError(player, message) {
    alt.emitClient(player, "chat::send_chat_messages", `{ff0000}Error: {f9f9f9}${message}`);
}

/* --- EXPORTS --- */
module.exports = {
    sendMessage,
    sendError
}