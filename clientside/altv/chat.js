/* ---- JAVASCRIPT VERSION -----
-                              -
-        REACT.JS CHAT         -
-       CREDITS: Adrian_       -
-                              -
- ---- JAVASCRIPT VERSION -----*/


/* --- IMPORT SECTION --- */
const alt = require("alt-client");

/* --- WEBVIEW INIT --- */
const chat_component_view = new alt.WebView("http://resource/client/game-ui/chat/index.html");
chat_component_view.focus();


/* --- KEYS --- */
alt.on("keyup", (key) => {
    
    switch (key) {

        case 84: {
            chat_component_view.emit("chat::set_chat_bar_status", true);
            if (alt.isCursorVisible()) alt.showCursor(false);
            alt.showCursor(true);
            alt.toggleGameControls(false);
            break;
        }
    }
});

/* --- EVENTS --- */
chat_component_view.on("chat::sendChatMessage", (message) => {
    alt.emitServer("chat::send_chat_message", message);
});
chat_component_view.on("chat::hide_client_chat", () => {
    alt.showCursor(false);
    alt.toggleGameControls(true);
});
chat_component_view.on("chat::executeChatCommand", (command) => {
    alt.emitServer("chat::execute_server_command", command);
});
chat_component_view.on("chat::update_chat_data_fontsize", (data) => { alt.LocalStorage.set("fontsize", data); alt.LocalStorage.save() });
chat_component_view.on("chat::update_chat_data_pagesize", (data) => { alt.LocalStorage.set("pagesize", data); alt.LocalStorage.save() });
chat_component_view.on("chat::update_chat_data_timestamp", (data) => { alt.LocalStorage.set("timestamp", data); alt.LocalStorage.save() });

alt.onServer("chat::send_chat_messages", (message) => {
    chat_component_view.emit("chat::send_chat_message", message);
});
alt.onServer("chat::load_connect_chat_data", () => {
    chat_component_view.emit('chat::update_chat_storage', {
        timeStamp: alt.LocalStorage.get("timestamp"),
        fontSize: alt.LocalStorage.get("fontsize"),
        pageSize: alt.LocalStorage.get("pagesize")
    });
});