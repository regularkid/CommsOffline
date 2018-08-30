class Memory extends System
{
    constructor()
    {
        super("MEMORY", 1);

        this.numSectors = 10;
        this.sectorError = [];
        for (let i = 0; i < this.numSectors; i++)
        {
            this.sectorError.push(false);
        }
    }

    update(deltaTime)
    {
        super.update(deltaTime);
    }

    setOffline()
    {
        super.setOffline();

        let numErrors = Math.random() < 0.5 ? 1 : 2;
        for (let i = 0; i < numErrors; i++)
        {
            let randSectorIdx = Math.floor(this.numSectors * Math.random());
            this.sectorError[randSectorIdx] = true;
        }
    }

    onHelpCommand(shortVersion)
    {
        shell.addMessage("memory: memory [check|fix [#]]\n");
        if (!shortVersion)
        {
            shell.addMessage("\n");
            shell.addMessage("Controls system memory.\n");
            shell.addMessage("\n");
            shell.addMessage("  check      display memory sectors (X=error)\n")
            shell.addMessage("  fix     fix memory sectors\n")
            shell.addMessage("     ex: memory fix 125\n")
            shell.addMessage("\n");
            shell.addMessage("alias: mem\n");
        }
    }

    onCommand(args)
    {
        if (args[0] === "check")
        {
            let message = "";
            for (let i = 0; i < this.numSectors; i++)
            {
                message += this.sectorError[i] ? " [X] " : " [ ] ";
                if (i == (this.numSectors / 2) - 1 || i == this.numSectors - 1)
                {
                    message += "\n";
                    shell.addMessage(message);
                    message = "";
                }
            }
        }
        else if (args[0] === "repair" && args.length === 2 && !isNaN(args[1]))
        {
            let sectors = [];
            for (let i = 0; i < args[1].length; i++)
            {
                let sectorIdx = parseInt(args[1].charAt()) - 1;
                sectors.push(sectorIdx);
            }

            let isValidArgs = true;
            for (let i = 0; i < sectors.length; i++)
            {
                if (!this.sectorError[sectors[i]])
                {
                    isValidArgs = false;
                    break;
                }
            }

            if (isValidArgs)
            {
                for (let i = 0; i < sectors.length; i++)
                {
                    this.sectorError[sectors[i]] = false;
                }

                shell.addMessage("sector errors repaired\n");

                if (!this.hasErrors())
                {
                    this.setOnline();
                }
            }
            else
            {
                shell.addMessage("invalid sectors specified - you may not specify working sectors.\n")
            }
        }
        else
        {
            this.onHelpCommand(false);
        }
    }

    hasErrors()
    {
        for (let i = 0; i < this.sectorError.length; i++)
        {
            if (this.sectorError[i])
            {
                return true;
            }
        }

        return false;
    }

    getAliases()
    {
        return ["mem"];
    }
}