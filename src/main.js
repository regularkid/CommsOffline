var screenWidth = 800;
var screenHeight = 600;
var screenScale = 1.0;

var aw = new Aw(screenWidth, screenHeight, screenScale, []);

aw.state = start;
function start()
{
    aw.addEntity(new Shell());
    aw.state = undefined;
}