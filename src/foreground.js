class Foreground
{
    render()
    {
        // Draw screen lines
        aw.ctx.fillStyle = "#FFF"
        aw.ctx.globalAlpha = 0.01;
        for (let i = 0; i < 100; i++)
        {
            aw.ctx.fillRect(0, i * 10, screenWidth, 7);
        }
        aw.ctx.globalAlpha = 1.0;

        // Draw scanline gradient
        let scanTime = 6000;
        let heightScanline = 400;
        let yScanline = ((Date.now() % scanTime) / scanTime) * (screenHeight + heightScanline)*1.5;

        let scanlineGradient = aw.ctx.createLinearGradient(0, yScanline - heightScanline, 0, yScanline);

        let numGradientStops = 100;
        let maxAlpha = 0.05;
        let maxAlphaPct = 0.95;
        for (let i = 0; i <= numGradientStops; i++)
        {
            let pct = i / numGradientStops;
            let alpha = 0.0;
            if (pct <= 0.95)
            {
                alpha = pct / maxAlphaPct;
            }
            else
            {
                alpha = 1.0 - ((pct - maxAlphaPct) / (1.0 - maxAlphaPct))
            }
            scanlineGradient.addColorStop(pct,`rgba(255, 255, 255, ${alpha * maxAlpha})`);
        }

        aw.ctx.fillStyle = scanlineGradient;
        aw.ctx.fillRect(0, yScanline - heightScanline, screenWidth, heightScanline);
    }
}