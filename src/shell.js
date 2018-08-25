class Shell
{
    constructor()
    {
        this.lines = [];
        this.x = 5;
        this.y = 5;
        this.maxLines = 20;
        this.maxLineLength = 66;
        this.lineHeight = 20;
        this.cursorBlinkTimer = 0;
        this.messages = [];
        this.handler = undefined;

        window.addEventListener("keydown", e => this.onKeyDown(e.key));
        this.addLine("> ");
    }

    addLine(text)
    {
        if (this.lines.length === this.maxLines)
        {
            this.lines.splice(0, 1);
        }

        this.lines.push(text);
    }

    addMessage(message, initDelay, charDelay)
    {
        // If we're currently on the prompt, start the message on a new line
        if (this.messages.length === 0)
        {
            this.addLine("");
        }

        this.messages.push(
        {
            message:message,
            initDelay:initDelay !== undefined ? initDelay : 0.0,
            charDelay:charDelay !== undefined ? charDelay : 0.005,
            curCharDelay:0.0
        });
    }

    onKeyDown(key)
    {
        // Don't allow typing while a message is being displayed
        if (this.messages.length > 0)
        {
            return;
        }

        let curLineIdx = this.lines.length - 1;
        let curLine = this.getCurLine();

        if (key === "Enter")
        {
            let fullCommand = curLine.slice(this.getPrefixLength()).toLowerCase().trim();
            let command = fullCommand.split(" ")[0];
            let args = fullCommand.split(" ").slice(1);

            if (this.handler !== undefined)
            {
                this.handler(command);
            }
            else
            {
                if (command in systemsByName)
                {
                    let system = systemsByName[command];
                    system.onCommand(args);
                }
                else if (command === "help")
                {
                    let system = (args.length > 0 && args[0] in systemsByName) ? systemsByName[args[0]] : undefined;
                    let shortVersion = args.length === 2 && args[1] === "-s"
                    let isValidHelpCommand = (args.length === 1 || (args.length === 2 && args[1] === "-s")) && system !== undefined && !system.isDisabled();
                    if (isValidHelpCommand)
                    {
                        system.onHelpCommand(shortVersion);
                    }
                    else
                    {
                        this.addMessage("Usage: help [system name] [-s]\n");
                        this.addMessage("  -s      short version\n");
                    }
                }
                else if (command === "clear")
                {
                    this.lines = [];
                    this.addLine("> ");
                }
                else
                {
                    this.addMessage("Unknown command\n", 0.1, 0.01);
                }
            }

            //aw.playNote("a", 1, 0.01);
        }
        else if (key === "Backspace")
        {
            if (curLine.length > this.getPrefixLength())
            {
                this.lines[curLineIdx] = this.lines[curLineIdx].slice(0, -1);
            }

            //aw.playNote("a", 1, 0.01);
        }
        else if (key.length === 1 && curLine.length < this.maxLineLength && /[a-zA-Z0-9\s.,-=\\!/@#$%^&*()_+;:'"`~]/.test(key))
        {
            this.lines[curLineIdx] += key;

            //aw.playNote("a", 1, 0.01);
        }
    }

    update(deltaTime)
    {
        if (this.messages.length > 0)
        {
            let curMessage = this.messages[0];
            if (curMessage.initDelay > 0.0)
            {
                curMessage.initDelay -= deltaTime;
            }
            else if (curMessage.message.length > 0)
            {
                let timeRemaining = deltaTime;
                while (timeRemaining > 0.0 && curMessage.message.length > 0)
                {
                    if (curMessage.curCharDelay > 0.0)
                    {
                        let tickTime = Math.min(timeRemaining, curMessage.curCharDelay);
                        timeRemaining -= tickTime;
                        curMessage.curCharDelay -= tickTime;
                    }

                    if (curMessage.curCharDelay <= 0.0)
                    {
                        let nextChar = curMessage.message[0];
                        if (nextChar === "\n")
                        {
                            this.addLine("");
                        }
                        else
                        {
                            let curLineIdx = this.lines.length - 1;
                            this.lines[curLineIdx] += nextChar;
                        }
                        
                        curMessage.message = curMessage.message.slice(1);
                        curMessage.curCharDelay = curMessage.charDelay;

                        //aw.playNote("a", 1, 0.01);
                    }
                }
            }
            else
            {
                this.messages.splice(0, 1);

                // Go back to prompt if we're done with our messages
                if (this.messages.length === 0)
                {
                    this.addLine("> ");
                }
            }
        }
    }

    render()
    {
        this.lines.forEach((line, index) =>
        {
            aw.drawText({text:line, x:this.x, y:this.y + (index * this.lineHeight), fontName:"courier", fontSize:14, fontStyle:"bold", color:foregroundColor, textBaseline:"top"})
        });

        if (Date.now() % 1000 < 500)
        {
            let xCursor = this.x + (this.lines[this.lines.length - 1].length * 8.4) + 2.0;
            let yCursor = this.y + ((this.lines.length - 1) * this.lineHeight);
            let widthCursor = this.lineHeight*0.35;
            let heightCursor = this.lineHeight*0.8;

            aw.ctx.fillStyle = foregroundColor;
            aw.ctx.fillRect(xCursor, yCursor, widthCursor, heightCursor);
        }
    }

    getCurLine()
    {
        let curLineIdx = this.lines.length - 1;
        return this.lines[curLineIdx];
    }

    getPrefixLength()
    {
        let curLineIdx = this.lines.length - 1;
        return this.lines[curLineIdx].startsWith("> ") ? 2 : 0;
    }

    setHandler(handler)
    {
        this.handler = handler;
    }
}