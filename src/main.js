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
    aw.ctx.fillRect(0, 406, 580, 2);

    // Horizontal line separating status display from health display
    aw.ctx.fillRect(0, 540, 580, 2);

    // Horizontal line separating systems display from data stream
    aw.ctx.fillRect(580, 510, 280, 2);
}