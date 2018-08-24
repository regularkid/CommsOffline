class Health
{
    constructor()
    {
        this.x = 5;
        this.y = 532;
        this.health = 100.0;
    }

    render()
    {
        aw.drawText({text:`SYSTEM HEALTH: ${this.health}%`, x:this.x, y:this.y + 8, fontName:"courier", fontSize:18, fontStyle:"bold", color:"#000", textBaseline:"middle"})

        let numBars = Math.floor(this.health / 5.0);
        for (let i = 0; i < numBars; ++i)
        {
            aw.ctx.fillStyle = foregroundColor;
            aw.ctx.fillRect(this.x + i*28.7, this.y + 24, 24.7, 38);
        }
    }
}