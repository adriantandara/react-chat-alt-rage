/* ---- TYPESCRIPT VERSION -----
-                              -
-        REACT.JS CHAT         -
-       CREDITS: Adrian_       -
-                              -
- ---- TYPESCRIPT VERSION -----*/

import * as alt from 'alt-server';

type ExecuteFunction = (player: PlayerMp, args: string[]) => Promise<void>;

export class CommandHandler {

    private name: string;
    private alias?: string[];
    private permission?: any[];
    private delay?: number;
    private disabled?: boolean;
    private execute: ExecuteFunction;
    private lastExecutionTimes: Map<string, number> = new Map();

    static handlers: { [command: string]: (player: PlayerMp, args: string[]) => void; } = {};

    constructor({ name, alias, permission, delay, disabled, execute }:
        { name: string, alias?: string[], permission?: any[], delay?: number, disabled?: boolean, execute: ExecuteFunction }) {
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

    async executeCommand(player: PlayerMp, args: string[]) {
        
        if (this.disabled) {
            sendMessage(player, 'ff0000', `Eroare: {f9f9f9}The command /${this.name} is disabled.`);
            return;
        }
        if (this.permission && !this.checkPermission(player, this.permission)) {
            sendMessage(player, 'ff0000', `Eroare: {f9f9f9}You do not have permission for this command.`);
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