/**
 * Represents Editor client-side commands.
 * Command syntax: "namespace:command@parameter". The namespace
 * and parameter parts are optional.
 */
export class EditorCommand {
    namespace;
    command;
    parameter;
    fullCommand;
    userData;

    constructor(commandString, userData) {
        if (typeof commandString === 'object' && commandString instanceof EditorCommand) {
            return commandString;
        }

        const re = /^(([^:]+):)?([^@]+)(@(.*))?$/;
        const matchData = commandString.match(re);

        if (!matchData.length) {
            throw new Error(
                `Editor commands must have format "command", "namespace:command" or "namespace:command@parameter". Invalid command string: ${commandString}`
            );
        }

        this.fullCommand = commandString;
        this.namespace = matchData[2] || null;
        this.parameter = matchData[5] || null;
        this.command = matchData[3];
        this.userData = userData === undefined ? {} : userData;
    }

    get hasParameter() {
        return this.parameter != null;
    }

    get basePart() {
        if (this.namespace === null) {
            return this.command;
        }

        return this.namespace + ':' + this.command;
    }

    matches(commandObject) {
        if (commandObject.fullCommand == this.fullCommand) {
            return true;
        }

        if (commandObject.hasParameter) {
            return false;
        }

        return this.basePart == commandObject.basePart;
    }
}
