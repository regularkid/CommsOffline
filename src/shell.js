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
            initDelay:initDelay,
            charDelay:charDelay,
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

        if (key === "Enter")
        {
            // TODO: Execute commands and do actual parsing here
            if (this.lines[curLineIdx] === "> message")
            {
                this.addMessage("Message Number 1\n", 1.0, 0.1);
            }
            else if (this.lines[curLineIdx] === "> help")
            {
                this.addMessage("This will be where help text goes.\n", 0.2, 0.0125);
                this.addMessage("2nd line.\n", 0.2, 0.0125);
                this.addMessage("3rd line.\n", 0.2, 0.0125);
            }
            else if (this.lines[curLineIdx] === "> clear")
            {
                this.lines = [];
                this.addLine("> ");
            }
            else
            {
                this.addMessage("Unknown command\n", 0.1, 0.01);
            }

            //aw.playNote("a", 1, 0.01);
        }
        else if (key === "Backspace")
        {
            if (this.lines[curLineIdx].length > 2)
            {
                this.lines[curLineIdx] = this.lines[curLineIdx].slice(0, -1);
            }

            //aw.playNote("a", 1, 0.01);
        }
        else if (key.length === 1 && this.lines[curLineIdx].length < this.maxLineLength && /[a-zA-Z0-9\s.,-=\\!/@#$%^&*()_+;:'"`~]/.test(key))
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
}