class Status
{
    constructor()
    {
        this.lines = [];
        this.x = 5;
        this.y = 410;
        this.lineHeight = 18;
        this.maxLines = 5;
    }

    addLine(text)
    {
        if (this.lines.length === this.maxLines)
        {
            this.lines.splice(0, 1);
        }

        this.lines.push(text);
    }

    render()
    {
        aw.drawText({text:"STATUS MESSAGES", x:this.x, y:this.y + 8, fontName:"courier", fontSize:18, fontStyle:"bold", color:"#000", textBaseline:"middle"})

        this.lines.forEach((line, index) =>
        {
            aw.drawText({text:line, x:this.x, y:this.y + 24 + (index * this.lineHeight), fontName:"courier", fontSize:14, fontStyle:"bold", color:foregroundColor, textBaseline:"top"})
        });
    }
}