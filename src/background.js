class Background
{
    render()
    {
        // Background
        aw.ctx.fillStyle = backgroundColor;
        aw.ctx.fillRect(0, 0, screenWidth, screenHeight);

        // Vertical line separating shell from systems display
        aw.ctx.fillStyle = foregroundColor;
        aw.ctx.fillRect(580, 0, 2, 600);

        // Horizontal line separating shell from status display
        aw.ctx.fillRect(0, 406, 580, 22);

        // Horizontal line separating status display from health display
        aw.ctx.fillRect(0, 528, 580, 22);

        // Horizontal line separating systems display from data stream
        aw.ctx.fillRect(580, 528, 280, 22);
    }
}