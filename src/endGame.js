class EndGame
{
    render()
    {
        aw.ctx.globalAlpha = 0.75;
        aw.ctx.fillStyle = "#000";
        aw.ctx.fillRect(0, 0, screenWidth, screenHeight);
        aw.ctx.globalAlpha = 1.0;

        aw.ctx.fillStyle = "#FFF";
        aw.ctx.fillRect(0, screenHeight*0.32, screenWidth, screenHeight*0.35);

        aw.ctx.fillStyle = "#880000";
        aw.ctx.fillRect(0, screenHeight*0.33, screenWidth, screenHeight*0.33);

        aw.drawText({text:"GAME OVER", x:screenWidth*0.5, y:screenHeight*0.5 - 70, fontName:"courier", fontSize:40,
                     fontStyle:"bold", color:"#FFF", textAlign:"center", textBaseline:"middle"});
    }
}