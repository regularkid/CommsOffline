class Network extends System
{
    constructor()
    {
        super("NETWORK", 2);

        this.isReverse = false;
        this.numDigits = 3;
        this.isStreamA = true;
    }

    update(deltaTime)
    {
        super.update(deltaTime);
    }

    setOffline()
    {
        super.setOffline();

        this.isReverse = false;//Math.random() < 0.2;
        this.numDigits = 3 + Math.floor(Math.random()*2);
        this.isStreamA = Math.random() < 0.3;
    }

    onHelpCommand(shortVersion)
    {
        shell.addMessage("network: network [update]\n");
        if (!shortVersion)
        {
            shell.addMessage("\n");
            shell.addMessage("Controls network protocols.\n");
            shell.addMessage("\n");
            shell.addMessage("  update    update network devices to latest protocols\n")
            shell.addMessage("\n");
            shell.addMessage("alias: net\n");
        }
    }

    onCommand(args)
    {
        if (args[0] === "update")
        {
            shell.addMessage(`Please enter ${this.numDigits}-digit protocol code from data stream ${this.isStreamA ? "A" : "B"}`);
            shell.handler = this;
        }
        else
        {
            this.onHelpCommand(false);
        }
    }

    commandHandler(command, args)
    {
        let data = this.isStreamA ? dataStream.getStreamA() : dataStream.getStreamB();
        console.log(this.isStreamA);
        console.log(data);
        console.log(command);
        if (data.includes(command))
        {
            shell.addMessage("Success");
        }
        else
        {
            shell.addMessage("Failure");
        }

        shell.handler = undefined;
        shell.addMessage("\n");
    }

    getAliases()
    {
        return ["net"];
    }
}