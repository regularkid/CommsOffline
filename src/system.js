class System
{
    constructor(name, systemIdx)
    {
        this.name = name;
        this.systemIdx = systemIdx;
        this.curState = "disabled";
        
        if (systemIdx === 0)
        {
            this.curState = "online";
        }
    }

    isDisabled()
    {
        return this.curState === "disabled";
    }

    isOnline()
    {
        return this.curState === "online";
    }

    isOffline()
    {
        return this.curState === "offline";
    }

    update(deltaTime)
    {
    }

    render()
    {
        if (this.isDisabled())
        {
            return;
        }

        let xRect = 590;
        let yRect = 10 + this.systemIdx*52;
        let widthRect = 200;
        let heightRect = 42;

        let displayOffline = this.isOffline() && (Date.now() % 500 < 250);
        if (displayOffline)
        {
            aw.ctx.fillStyle = "#880000";
            aw.ctx.fillRect(xRect, yRect, widthRect, heightRect);
        }

        aw.ctx.strokeStyle = foregroundColor;
        aw.ctx.lineWidth = 2;
        aw.ctx.strokeRect(xRect, yRect, widthRect, heightRect);

        let fontColor = displayOffline ? "#FFF" : foregroundColor;
        aw.drawText({text:this.name, x:xRect + 10, y:yRect + 22, fontName:"courier", fontSize:28, fontStyle:"bold", color:fontColor, textBaseline:"middle"})
    }
}