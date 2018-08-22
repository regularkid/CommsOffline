var screenWidth = 800;
var screenHeight = 600;
var screenScale = 1.0;
var backgroundColor = "#141414";
var foregroundColor = "#02E002";

var aw = new Aw(screenWidth, screenHeight, screenScale, []);

aw.state = start;
function start()
{
    aw.addEntity(new Shell());
    aw.addEntity(new Status());
    aw.addEntity(new Health());
    aw.addEntity(new DataStream());

    // DEBUG TESTING
    aw.addEntity(new System("COMMS", 0));
    aw.addEntity(new System("MEMORY", 1));
    aw.addEntity(new System("SECURITY", 2));
    aw.addEntity(new System("THERMAL", 3));
    aw.addEntity(new System("IMAGING", 4));
    aw.addEntity(new System("NETWORK", 5));
    aw.addEntity(new System("PROPULSION", 6));
    aw.addEntity(new System("LASERS", 7));
    aw.addEntity(new System("TIMING", 8));
    aw.addEntity(new System("GRAVITY", 9));

    aw.state = playing;
}

function playing()
{
    drawConsole();
}

function drawConsole()
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

    var scanlineGradient = aw.ctx.createLinearGradient(0, yScanline - heightScanline, 0, yScanline);
    scanlineGradient.addColorStop(0,"rgba(255, 255, 255, 0.0)");
    scanlineGradient.addColorStop(0.95,"rgba(255, 255, 255, 0.03)");
    scanlineGradient.addColorStop(1,"rgba(255, 255, 255, 0.00)");

    aw.ctx.fillStyle = scanlineGradient;
    aw.ctx.fillRect(0, yScanline - heightScanline, screenWidth, heightScanline);
}