/* ---- TYPESCRIPT VERSION -----
-                              -
-        REACT.JS CHAT         -
-       CREDITS: Adrian_       -
-                              -
- ---- TYPESCRIPT VERSION -----*/


/* --- VARIABLES --- */
const chat_browser_component: BrowserMp = mp.browsers.new("package://path_ui/chat/index.html");

/* --- EVENTS --- */
mp.events.add("chat::sendChatMessage", (message: string) => {
    mp.events.callRemote("chat::send_chat_message", message);
});
mp.events.add("chat::hide_client_chat", () => {
    mp.gui.cursor.show(false, false);
});
mp.events.add("chat::executeChatCommand", (command: message) => {
    mp.events.callRemote("chat::execute_server_command", command);
});
mp.events.add("chat::update_chat_data_fontsize", (data: number) => mp.storage.data.fontsize = data);
mp.events.add("chat::update_chat_data_pagesize", (data: number) => mp.storage.data.pagesize = data);
mp.events.add("chat::update_chat_data_timestamp", (data: boolean) => mp.storage.data.timestamp = data);

mp.events.add("chat::send_chat_messages", (message: string) => {
    chat_component_view.execute(`send_chat_message(${JSON.stringify(message)})`);
});
mp.events.add("chat::load_connect_chat_data", () => {
    chat_component_view.execute(`update_chat_storage({ timeStamp: ${mp.storage.data.timestamp}, fontSize: ${mp.storage.data.fontsize}, pageSize: ${mp.storage.data.pageSize} })`);
});

/* --- KEYS --- */
mp.keys.new(0x54, false, function() {
    chat_browser_component.execute("set_chat_bar_status(true)");
    if (mp.gui.cursor.visibile) mp.gui.cursor.show(false, false);
    mp.gui.cursor.show(true, true);
});