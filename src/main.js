var screenWidth = 800;
var screenHeight = 600;
var screenScale = 1.0;

var aw = new Aw(screenWidth, screenHeight, screenScale, []);

aw.state = start;
function start()
{
    aw.addEntity(new Shell());
    aw.state = playing;
}

function playing()
{
    drawConsole();
}

function drawConsole()
{
    // Vertical line separating shell from systems display
    aw.ctx.fillStyle="#FFF";
    aw.ctx.fillRect(580, 0, 2, 600);

    // Horizontal line separating shell from status display
    aw.ctx.fillStyle="#FFF";
    aw.ctx.fillRect(0, 406, 580, 2);

    // Horizontal line separating status display from health display
    aw.ctx.fillStyle="#FFF";
    aw.ctx.fillRect(0, 540, 580, 2);

    // Horizontal line separating systems display from data stream
    aw.ctx.fillStyle="#FFF";
    aw.ctx.fillRect(580, 540, 280, 2);
}