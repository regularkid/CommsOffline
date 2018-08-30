class DataStream
{
    constructor()
    {
        this.data = [];
        this.data.push("");
        this.data.push("");
        this.x = 610;
        this.y = 532;
        this.health = 100.0;
        this.lineHeight = 18;
        this.addCharacterDelay = 0.25;
        this.addCharacterDelayCur = 0.0;
        this.maxCharacters = 22;
        this.characterSet = "abcdefghijklmnopqrstuvwxyz0123456789";
        this.addToA = false;

        for (let i = 0; i < this.maxCharacters; ++i)
        {
            this.addCharacter(true);
        }
    }

    addCharacter(addToA)
    {
        for (let i = 0; i < this.data.length; ++i)
        {
            if (i !==0 || addToA)
            {
                if (this.data[i].length === this.maxCharacters)
                {
                    this.data[i] = this.data[i].slice(1);
                }

                this.data[i] += this.characterSet.charAt(Math.floor(Math.random() * this.characterSet.length));
            }
        }
    }

    update(deltaTime)
    {
        this.addCharacterDelayCur -= deltaTime;
        if (this.addCharacterDelayCur <= 0.0)
        {
            this.addToA = !this.addToA;
            this.addCharacterDelayCur = this.addCharacterDelay;
            this.addCharacter(this.addToA);
        }
    }

    render()
    {
        aw.drawText({text:"DATA STREAM", x:this.x, y:this.y + 8, fontName:"courier", fontSize:18, fontStyle:"bold", color:"#000", textBaseline:"middle"})

        aw.drawText({text:"A:", x:this.x - 22, y:this.y + 24, fontName:"courier", fontSize:14, fontStyle:"bold", color:foregroundColor, textBaseline:"top"})
        aw.drawText({text:"B:", x:this.x - 22, y:this.y + 24 + this.lineHeight, fontName:"courier", fontSize:14, fontStyle:"bold", color:foregroundColor, textBaseline:"top"})
        for (let i = 0; i < this.data.length; ++i)
        {
            aw.drawText({text:this.data[i], x:this.x, y:this.y + 24 + (this.lineHeight * i), fontName:"courier", fontSize:14, fontStyle:"bold", color:foregroundColor, textBaseline:"top"})
        }
    }

    getStreamA()
    {
        return this.data[0];
    }

    getStreamB()
    {
        return this.data[1];
    }
}