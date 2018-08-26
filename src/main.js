var screenWidth = 800;
var screenHeight = 600;
var screenScale = 1.4;
var backgroundColor;
var foregroundColor;
var systems;
var systemsByName;
var shell;
var statusDisplay;
var healthDisplay;
var dataStream;

var aw = new Aw(screenWidth, screenHeight, screenScale, []);

aw.state = start;
function start()
{
    backgroundColor = "#141414";
    foregroundColor = "#02E002";

    aw.addEntity(new GameController());
    aw.addEntity(new Background());

    // Terminal elements
    shell = new Shell();
    statusDisplay = new Status();
    healthDisplay = new Health();
    dataStream = new DataStream();

    aw.addEntity(shell);
    aw.addEntity(statusDisplay);
    aw.addEntity(healthDisplay);
    aw.addEntity(dataStream);

    // Systems
    systems = [];
    systems.push(new Comms());
    systems.push(new System("MEMORY", 1));
    systems.push(new System("SECURITY", 2));
    systems.push(new System("THERMAL", 3));
    systems.push(new System("IMAGING", 4));
    systems.push(new System("NETWORK", 5));
    systems.push(new System("PROPULSION", 6));
    systems.push(new System("LASERS", 7));
    systems.push(new System("TIMING", 8));
    systems.push(new System("GRAVITY", 9));

    systemsByName = {};
    systems.forEach(system =>
    {
        aw.addEntity(system);
        systemsByName[system.name.toLowerCase()] = system;
    });

    aw.addEntity(new Foreground());

    aw.state = playing;
}

function playing()
{
    if (healthDisplay.isDead())
    {
        aw.addEntity(new EndGame())
        aw.state = gameOver;
    }
}

function gameOver()
{
    if (aw.keysJustPressed.r)
    {
        aw.clearAllEntities();
        aw.state = start;
    }
}