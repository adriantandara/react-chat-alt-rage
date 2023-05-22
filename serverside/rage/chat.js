/* ---- JAVASCRIPT VERSION -----
-                              -
-        REACT.JS CHAT         -
-       CREDITS: Adrian_       -
-                              -
- ---- JAVASCRIPT VERSION -----*/

/* --- VARIABLES --- */
const hexColorPattern = /\{[0-9a-fA-F]{6}\}/;

/* --- EVENTS --- */
mp.events.add('chat::send_chat_message', (player, message) => {
    const processedMessage = message.replace(hexColorPattern, '');
    const nearPlayers = mp.players.filter((p) => p.pos.distanceTo(player.pos) < 20);
    nearPlayers.call('chat::send_chat_messages', `${player.name}: ${processedMessage}`);
});
mp.events.add('chat::execute_server_command', (player, message) => {
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
    player.call("chat::send_chat_messages", `{${color}}${message}`);
}
function sendError(player, message) {
    player.call("chat::send_chat_messages", `{ff0000}Error: {f9f9f9}${message}`);
}

/* --- EXPORTS --- */
module.exports = {
    sendMessage,
    sendError
}