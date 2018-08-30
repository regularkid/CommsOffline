class Comms extends System
{
    constructor()
    {
        super("COMMS", 0);
    }

    update(deltaTime)
    {
        super.update(deltaTime);
    }

    onHelpCommand(shortVersion)
    {
        shell.addMessage("comms: comms [on|off]\n");
        if (!shortVersion)
        {
            shell.addMessage("\n");
            shell.addMessage("Controls the communications system.\n");
            shell.addMessage("\n");
            shell.addMessage("  on      enable communications\n")
            shell.addMessage("  off     disable communications\n")
            shell.addMessage("\n");
            shell.addMessage("alias: com\n");
        }
    }

    onCommand(args)
    {
        if (args[0] === "on")
        {
            this.curState = "online";
            shell.addMessage("");
            statusDisplay.addLine("communications system online");
        }
        else if (args[0] === "off")
        {
            this.curState = "offline";
            shell.addMessage("");
            statusDisplay.addLine("communications system offline");
        }
        else
        {
            this.onHelpCommand(false);
        }
    }

    getAliases()
    {
        return ["com"];
    }
}