class Health
{
    constructor()
    {
        this.x = 5;
        this.y = 532;
        this.health = 100.0;
        this.decreasePerSecPerOfflineSys =
        [
            0.0,
            1.0,
            1.5,
            2.5,
            3.0,
            3.5,
            4.0,
            4.5,
            5.0,
            6.0,
            6.5,
        ];
    }

    update(deltaTime)
    {
        this.health = Math.max(this.health - (this.decreasePerSecPerOfflineSys[System.GetNumSystemsOffline()] * deltaTime), 0.0);
    }

    render()
    {
        aw.drawText({text:`SYSTEM HEALTH: ${Math.floor(this.health)}%`, x:this.x, y:this.y + 8, fontName:"courier", fontSize:18, fontStyle:"bold", color:"#000", textBaseline:"middle"})

        let numBars = Math.floor(this.health / 5.0);
        let barColor = foregroundColor;
        if (this.health <= 15.0)
        {
            barColor = (Date.now() % 250 < 125) ? "#880000" : foregroundColor;
        }
        else if (this.health <= 33.0)
        {
            barColor = (Date.now() % 500 < 250) ? "#880000" : foregroundColor;
        }

        for (let i = 0; i < numBars; ++i)
        {
            aw.ctx.fillStyle = barColor;
            aw.ctx.fillRect(this.x + i*28.7, this.y + 24, 24.7, 38);
        }
    }

    isDead()
    {
        return false;//this.health <= 0.0;
    }
}