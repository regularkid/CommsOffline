class DataStream
{
    constructor()
    {
        this.data = [];
        this.data.push("");
        this.data.push("");
        this.x = 585;
        this.y = 532;
        this.health = 100.0;
        this.lineHeight = 18;
        this.addCharacterDelay = 0.5;
        this.addCharacterDelayCur = 0.0;
        this.maxCharacters = 50;
        this.characterSet = "abcdefghijklmnopqrstuvwxyz0123456789";

        for (let i = 0; i < this.maxCharacters; ++i)
        {
            this.addCharacter();
        }
    }

    addCharacter()
    {
        for (let i = 0; i < this.data.length; ++i)
        {
            if (this.data[i].length === this.maxCharacters)
            {
                this.data[i] = this.data[i].slice(1);
            }

            this.data[i] += this.characterSet.charAt(Math.floor(Math.random() * this.characterSet.length));
        }
    }

    update(deltaTime)
    {
        this.addCharacterDelayCur -= deltaTime;
        if (this.addCharacterDelayCur <= 0.0)
        {
            this.addCharacterDelayCur = this.addCharacterDelay;
            this.addCharacter();
        }
    }

    render()
    {
        aw.drawText({text:"DATA STREAM", x:this.x, y:this.y + 8, fontName:"courier", fontSize:18, fontStyle:"bold", color:"#000", textBaseline:"middle"})

        for (let i = 0; i < this.data.length; ++i)
        {
            aw.drawText({text:this.data[i].substr(0, this.maxCharacters / 2), x:this.x, y:this.y + 24 + (this.lineHeight * i), fontName:"courier", fontSize:14, fontStyle:"bold", color:foregroundColor, textBaseline:"top"})
        }
    }
}