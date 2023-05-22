/* ---- JAVASCRIPT VERSION -----
-                              -
-        REACT.JS CHAT         -
-       CREDITS: Adrian_       -
-                              -
- ---- JAVASCRIPT VERSION -----*/

class CommandHandler {
    
    static handlers = {};

    constructor({ name, alias, permission, delay, disabled, execute }) {
        this.name = name.toLowerCase();
        this.alias = alias?.map(a => a.toLowerCase());
        this.permission = permission;
        this.delay = delay;
        this.disabled = disabled;
        this.execute = execute;
        this.register();
    }

    register() {
        if (CommandHandler.handlers[this.name] !== undefined) {
            console.log(`Failed to register command /${this.name}, already registered`);
        } else {
            CommandHandler.handlers[this.name] = this.executeCommand.bind(this);
            this.alias?.forEach(a => {
                if (CommandHandler.handlers[a] !== undefined) {
                    console.log(`Failed to register command /${a}, already registered`);
                } else {
                    CommandHandler.handlers[a] = this.executeCommand.bind(this);
                }
            });
        }
    }

    async executeCommand(player, args) {
        
        if (this.disabled) {
            sendMessage(player, COLORS.COLOR_SERVER, `Eroare: {f9f9f9}The command /${this.name} is disabled.`);
            return;
        }
        if (this.permission && !this.checkPermission(player, this.permission)) {
            sendMessage(player, COLORS.COLOR_SERVER, `Eroare: {f9f9f9}You do not have permission for this command.`);
            return;
        }
        const commandName = this.name;
        const now = Date.now();
        const lastExecutionTime = this.lastExecutionTimes.get(commandName) || 0;
    
        if (now - lastExecutionTime < this.delay * 1000) {
            const remainingDelay = Math.ceil((lastExecutionTime + (this.delay * 1000) - now) / 1000);
            sendMessage(player, COLORS.COLOR_SERVER, `Eroare: {ffffff}Wait ${remainingDelay} seconds to execute this command.`);
            return;
        }
        this.lastExecutionTimes.set(commandName, now);

        try {
            await this.execute(player, args);
        } catch (error) {
            console.log(`Error executing command /${this.name}: ${error.message}.`);
        }
    }

    checkPermission(player, permission) {
        const [role, level] = permission;
    
        /* --- EXEMPLE --- */
        // if (role === 'Admin' && (!player.admin || player.admin < level)) {
        //     return false;
        // }
        return true;
    }

    setDelay(delay) {
        this.delay = delay;
    }

    setPermission(permission) {
        this.permission = permission;
    }

    disableCommand() {
        this.disabled = true;
    }

    enableCommand() {
        this.disabled = false;
    }
}

CommandHandler.handlers = {};

module.exports = { CommandHandler }