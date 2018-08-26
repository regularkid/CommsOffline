class Aw
{
    //////////////////////////
    //-------- CORE --------//
    //////////////////////////

    constructor(width, height, scale, assetList)
    {
        this.initDisplay(width, height, scale);
        this.initEntities();
        this.initInput();
        this.initAudio();

        this.loadAssets(assetList);

        this.gameLoop(performance.now());
    }

    initDisplay(width, height, scale)
    {
        this.canvas = document.createElement("canvas");
        this.canvas.setAttribute("width", width);
        this.canvas.setAttribute("height", height);
        this.canvas.style.width = `${width * scale}px`;
        this.canvas.style.height = `${height * scale}px`;
        this.canvas.style.backgroundColor = "black";
        //this.canvas.style["image-rendering"] = "pixelated";
        document.getElementById("game").appendChild(this.canvas);

        this.ctx = this.canvas.getContext('2d');
        this.width = width;
        this.height = height;
        this.scale = scale;
    }

    loadAssets(assetList)
    {
        this.assets = {};

        assetList.forEach(assetName =>
        {
            this.assets[assetName] = {};
            this.assets[assetName].loaded = false;

            if (assetName.endsWith(".png") || assetName.endsWith(".jpg"))
            {
                this.assets[assetName].data = new Image();
                this.assets[assetName].data.onload = () => this.assets[assetName].loaded = true;
                this.assets[assetName].data.src = assetName;
            }
            else if (assetName.endsWith(".wav") || assetName.endsWith(".mp3"))
            {
                this.assets[assetName].data = new Audio();
                //this.assets[assetName].data.addEventListener("load", () => this.assets[assetName].loaded = true, true);
                this.assets[assetName].data.src = assetName;
                this.assets[assetName].data.load();
                this.assets[assetName].loaded = true;
            }
            else
            {
                console.assert(false, `Unable to load ${assetName} - unknown type`);
            }
        });
    }

    isLoading()
    {
        return Object.keys(this.assets).length > 0 && Object.values(this.assets).every(asset => asset.loaded) == false;
    }

    getAsset(assetName)
    {
        console.assert(this.assets[assetName] !== undefined, `No asset loaded named '${assetName}'`);
        return this.assets[assetName].data;
    }

    gameLoop(curTime)
    {
        window.requestAnimationFrame(this.gameLoop.bind(this));
        
        if (this.isLoading()) { return; }

        let deltaTime = Math.min((curTime - (this.lastTime || curTime)) / 1000.0, 0.2);  // Cap to 200ms (5fps)
        this.lastTime = curTime;

        this.ctx.clearRect(0, 0, this.width, this.height);

        if (this.state !== undefined)
        {
            this.state(deltaTime);
        }

        this.sortEntities();
        this.updateEntities(deltaTime);
        this.renderEntities();

        this.postUpdateInput();
    }

    //////////////////////////
    //------ ENTITIES ------//
    //////////////////////////

    initEntities()
    {
        this.entities = [];
        this.entitiesNeedSorting = false;
        this.entitiesNeedRemoval = false;
    }

    addEntity(entity)
    {
        Object.defineProperty(entity, "z",
        {
            set: (value) =>
            {
                entity._z = value;
                this.entitiesNeedSorting = true;
            },
            get: () => { return entity._z; }
        });
        entity._z = this.entities.length > 0 ? this.entities[this.entities.length - 1].z + 1 : 0;

        this.entities.push(entity);
    }

    removeEntity(entity)
    {
        entity._remove = true;
        this.entitiesNeedRemoval = true;
    }

    updateEntities(deltaTime)
    {
        this.entities.forEach(entity =>
        {
            if (entity.update !== undefined) { entity.update(deltaTime); }
        });

        if (this.entitiesNeedRemoval)
        {
            this.entities = this.entities.filter(entity => entity._remove !== true);
            this.entitiesNeedRemoval = false;
        }
    }

    renderEntities()
    {
        this.entities.forEach(entity =>
        {
            if (entity.render !== undefined) { entity.render(); }
        });
    }

    sortEntities()
    {
        if (this.entitiesNeedSorting)
        {
            // Higher values update/render later than lower values
            this.entities.sort((entity1, entity2) => entity1.z - entity2.z);
            this.entitiesNeedSorting = false;
        }
    }

    clearAllEntities()
    {
        this.entities = [];
    }

    //////////////////////////
    //----- RENDERING ------//
    //////////////////////////

    drawSprite(params)
    {
        // Assumes name, x, and y are defined in params
        let image = this.getAsset(params.name);
        let angle = params.angle !== undefined ? params.angle : 0;
        let width = params.xScale !== undefined ? image.width * params.xScale : image.width;
        let height = params.yScale !== undefined ? image.height * params.yScale : image.height;

        this.ctx.save();
        this.ctx.translate(params.x, params.y);
        this.ctx.rotate(angle * Math.PI/180);
        this.ctx.drawImage(image, -width * 0.5, -height * 0.5, width, height);
        this.ctx.restore();
    }

    drawText(params)
    {
        // Assumes text, x, and y are defined in params
        let angle = params.angle !== undefined ? params.angle * Math.PI/180 : 0;
        let fontName = params.fontName !== undefined ? params.fontName : "Arial";
        let fontSize = params.fontSize !== undefined ? params.fontSize : 12;
        let fontStyle = params.fontStyle !== undefined ? params.fontStyle : "";
        let fillStyle = params.color !== undefined ? params.color : "#FFF";
        let textAlign = params.textAlign !== undefined ? params.textAlign.toLowerCase() : "left";
        let textBaseline = params.textBaseline !== undefined ? params.textBaseline.toLowerCase() : "bottom";

        this.ctx.save();
        this.ctx.translate(params.x, params.y);
        this.ctx.rotate(angle);
        this.ctx.font = `${fontStyle} ${fontSize}px ${fontName}`;
        this.ctx.fillStyle = fillStyle;
        this.ctx.textAlign = textAlign;
        this.ctx.textBaseline = textBaseline;
        this.ctx.fillText(params.text, 0, 0);
        this.ctx.restore();
    }

    ///////////////////////////
    //-------- AUDIO --------//
    ///////////////////////////

    initAudio()
    {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();

        this.notes =
        {
            "c": 16.35,
            "c#": 17.32,
            "d": 18.35,
            "d#": 19.45,
            "e": 20.60,
            "f": 21.83,
            "f#": 23.12,
            "g": 24.50,
            "g#": 25.96,
            "a": 27.50,
            "a#": 29.14,
            "b": 30.87,
        }
    }

    playAudio(name, loop)
    {
        this.getAsset(name).loop = loop !== undefined ? loop : false;
        this.getAsset(name).play();
    }

    stopAudio(name)
    {
        this.getAsset(name).pause();
        this.getAsset(name).currentTime = 0;
    }

    playNote(note, octave, length)
    {
        let oscillator = this.audioCtx.createOscillator();
        let noteFrequency = this.notes[note.toLowerCase()];
        if (octave !== undefined)
        {
            noteFrequency *= Math.pow(2, octave);
        }

        oscillator.type = "triangle";
        oscillator.frequency.setValueAtTime(noteFrequency, this.audioCtx.currentTime);
        
        oscillator.connect(this.audioCtx.destination);
        oscillator.start();
        oscillator.stop(this.audioCtx.currentTime + (length !== undefined ? length : 0.2));  
    }

    ///////////////////////////
    //-------- INPUT --------//
    ///////////////////////////

    initInput()
    {
        this.mousePos = {x: 0, y: 0};
        this.mouseDelta = {x: 0, y: 0};
        this.mouseLeftButton = false;
        this.mouseRightButton = false;
        this.mouseLeftButtonJustPressed = false;
        this.mouseRightButtonJustPressed = false;

        window.addEventListener("mousemove", e =>
        {
            this.mouseDelta.x += e.movementX;
            this.mouseDelta.y += e.movementY;
            this.mousePos = {x: e.clientX, y: e.clientY};
        });

        window.addEventListener("mousedown", e =>
        {
            if (e.button === 0) { this.mouseLeftButton = true; this.mouseLeftButtonJustPressed = true; }
            else if (e.button === 2) { this.mouseRightButton = true; this.mouseRightButtonJustPressed = true; }
        });

        window.addEventListener("mouseup", e =>
        {
            if (e.button === 0) { this.mouseLeftButton = false; }
            else if (e.button === 2) { this.mouseRightButton = false; }
        });

        this.keyToName =
        {
            "a": "a", "b": "b", "c": "c", "d": "d", "e": "e", "f": "f", "g": "g", "h": "h", "i": "i",
            "j": "j", "k": "k", "l": "l", "m": "m", "n": "n", "o": "o", "p": "p", "q": "q", "r": "r",
            "s": "s", "t": "t", "u": "u", "v": "v", "w": "w", "x": "x", "y": "y", "z": "z",
            "0": "zero", "1": "one", "2": "two", "3": "three", "4": "four", "5": "five", "6": "six", "7": "seven", "8": "eight", "9": "nine",
            "arrowup": "up", "arrowdown": "down", "arrowleft": "left", "arrowright": "right", " ": "space", "escape": "escape",
            "control": "ctrl", "shift": "shift", "alt": "alt", "tab": "tab", "enter": "enter", "backspace": "backspace"
        };

        this.keys = {};
        this.keysJustPressed = {};
        Object.keys(this.keyToName).forEach(key => this.keys[key] = false);

        window.addEventListener("keydown", e =>
        {
            this.setKeyState(e, true);
        });

        window.addEventListener("keyup", e =>
        {
            this.setKeyState(e, false);
        });
    }

    setKeyState(event, isOn)
    {
        let keyCode = event.key.toLowerCase();
        if (this.keyToName[keyCode] !== undefined)
        {
            let keyName = this.keyToName[keyCode];
            this.keysJustPressed[keyName] = this.keys[keyName] === false || this.keys[keyName] === undefined;
            this.keys[keyName] = isOn;
            
            // Hack: prevent arrow keys from scrolling the page
            if (keyName === "up" || keyName === "down" || keyName === "left" || keyName === "right")
            {
                event.preventDefault();
            }
        }
    }

    postUpdateInput()
    {
        this.mouseDelta.x = 0.0;
        this.mouseDelta.y = 0.0;
        this.mouseLeftButtonJustPressed = false;
        this.mouseRightButtonJustPressed = false;

        Object.keys(this.keysJustPressed).forEach(key =>
        {
            this.keysJustPressed[key] = false;
        });
    }
}
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
class Shell
{
    constructor()
    {
        this.lines = [];
        this.x = 5;
        this.y = 5;
        this.maxLines = 20;
        this.maxLineLength = 66;
        this.lineHeight = 20;
        this.cursorBlinkTimer = 0;
        this.messages = [];
        this.handler = undefined;

        window.addEventListener("keydown", e => this.onKeyDown(e.key));
        this.addLine("> ");
    }

    addLine(text)
    {
        if (this.lines.length === this.maxLines)
        {
            this.lines.splice(0, 1);
        }

        this.lines.push(text);
    }

    addMessage(message, initDelay, charDelay)
    {
        // If we're currently on the prompt, start the message on a new line
        if (this.messages.length === 0)
        {
            this.addLine("");
        }

        this.messages.push(
        {
            message:message,
            initDelay:initDelay !== undefined ? initDelay : 0.0,
            charDelay:charDelay !== undefined ? charDelay : 0.005,
            curCharDelay:0.0
        });
    }

    onKeyDown(key)
    {
        // Don't allow typing while a message is being displayed
        if (this.messages.length > 0 || healthDisplay.isDead())
        {
            return;
        }

        let curLineIdx = this.lines.length - 1;
        let curLine = this.getCurLine();

        if (key === "Enter")
        {
            let fullCommand = curLine.slice(this.getPrefixLength()).toLowerCase().trim();
            let command = fullCommand.split(" ")[0];
            let args = fullCommand.split(" ").slice(1);

            if (this.handler !== undefined)
            {
                this.handler(command);
            }
            else
            {
                if (command in systemsByName)
                {
                    let system = systemsByName[command];
                    system.onCommand(args);
                }
                else if (command === "help")
                {
                    let system = (args.length > 0 && args[0] in systemsByName) ? systemsByName[args[0]] : undefined;
                    let shortVersion = args.length === 2 && args[1] === "-s"
                    let isValidHelpCommand = (args.length === 1 || (args.length === 2 && args[1] === "-s")) && system !== undefined && !system.isDisabled();
                    if (isValidHelpCommand)
                    {
                        system.onHelpCommand(shortVersion);
                    }
                    else
                    {
                        this.addMessage("Usage: help [system name] [-s]\n");
                        this.addMessage("  -s      short version\n");
                    }
                }
                else if (command === "clear")
                {
                    this.lines = [];
                    this.addLine("> ");
                }
                else
                {
                    this.addMessage("Unknown command\n", 0.1, 0.01);
                }
            }

            //aw.playNote("a", 1, 0.01);
        }
        else if (key === "Backspace")
        {
            if (curLine.length > this.getPrefixLength())
            {
                this.lines[curLineIdx] = this.lines[curLineIdx].slice(0, -1);
            }

            //aw.playNote("a", 1, 0.01);
        }
        else if (key.length === 1 && curLine.length < this.maxLineLength && /[a-zA-Z0-9\s.,-=\\!/@#$%^&*()_+;:'"`~]/.test(key))
        {
            this.lines[curLineIdx] += key;

            //aw.playNote("a", 1, 0.01);
        }
    }

    update(deltaTime)
    {
        if (this.messages.length > 0 && !healthDisplay.isDead())
        {
            let curMessage = this.messages[0];
            if (curMessage.initDelay > 0.0)
            {
                curMessage.initDelay -= deltaTime;
            }
            else if (curMessage.message.length > 0)
            {
                let timeRemaining = deltaTime;
                while (timeRemaining > 0.0 && curMessage.message.length > 0)
                {
                    if (curMessage.curCharDelay > 0.0)
                    {
                        let tickTime = Math.min(timeRemaining, curMessage.curCharDelay);
                        timeRemaining -= tickTime;
                        curMessage.curCharDelay -= tickTime;
                    }

                    if (curMessage.curCharDelay <= 0.0)
                    {
                        let nextChar = curMessage.message[0];
                        if (nextChar === "\n")
                        {
                            this.addLine("");
                        }
                        else
                        {
                            let curLineIdx = this.lines.length - 1;
                            this.lines[curLineIdx] += nextChar;
                        }
                        
                        curMessage.message = curMessage.message.slice(1);
                        curMessage.curCharDelay = curMessage.charDelay;

                        //aw.playNote("a", 1, 0.01);
                    }
                }
            }
            else
            {
                this.messages.splice(0, 1);

                // Go back to prompt if we're done with our messages
                if (this.messages.length === 0)
                {
                    this.addLine("> ");
                }
            }
        }
    }

    render()
    {
        this.lines.forEach((line, index) =>
        {
            aw.drawText({text:line, x:this.x, y:this.y + (index * this.lineHeight), fontName:"courier", fontSize:14, fontStyle:"bold", color:foregroundColor, textBaseline:"top"})
        });

        if (!healthDisplay.isDead() && Date.now() % 1000 < 500)
        {
            let xCursor = this.x + (this.lines[this.lines.length - 1].length * 8.4) + 2.0;
            let yCursor = this.y + ((this.lines.length - 1) * this.lineHeight);
            let widthCursor = this.lineHeight*0.35;
            let heightCursor = this.lineHeight*0.8;

            aw.ctx.fillStyle = foregroundColor;
            aw.ctx.fillRect(xCursor, yCursor, widthCursor, heightCursor);
        }
    }

    getCurLine()
    {
        let curLineIdx = this.lines.length - 1;
        return this.lines[curLineIdx];
    }

    getPrefixLength()
    {
        let curLineIdx = this.lines.length - 1;
        return this.lines[curLineIdx].startsWith("> ") ? 2 : 0;
    }

    setHandler(handler)
    {
        this.handler = handler;
    }
}
class Status
{
    constructor()
    {
        this.lines = [];
        this.x = 5;
        this.y = 410;
        this.lineHeight = 18;
        this.maxLines = 5;
    }

    addLine(text)
    {
        if (this.lines.length === this.maxLines)
        {
            this.lines.splice(0, 1);
        }

        this.lines.push(text);
    }

    render()
    {
        aw.drawText({text:"STATUS MESSAGES", x:this.x, y:this.y + 8, fontName:"courier", fontSize:18, fontStyle:"bold", color:"#000", textBaseline:"middle"})

        this.lines.forEach((line, index) =>
        {
            aw.drawText({text:line, x:this.x, y:this.y + 24 + (index * this.lineHeight), fontName:"courier", fontSize:14, fontStyle:"bold", color:foregroundColor, textBaseline:"top"})
        });
    }
}
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
        for (let i = 0; i < numBars; ++i)
        {
            aw.ctx.fillStyle = foregroundColor;
            aw.ctx.fillRect(this.x + i*28.7, this.y + 24, 24.7, 38);
        }
    }

    isDead()
    {
        return this.health <= 0.0;
    }
}
class DataStream
{
    constructor()
    {
        this.data = [];
        this.data.push("");
        this.data.push("");
        this.x = 585;
        this.y = 532;
        this.health = 100.0;
        this.lineHeight = 18;
        this.addCharacterDelay = 0.5;
        this.addCharacterDelayCur = 0.0;
        this.maxCharacters = 50;
        this.characterSet = "abcdefghijklmnopqrstuvwxyz0123456789";

        for (let i = 0; i < this.maxCharacters; ++i)
        {
            this.addCharacter();
        }
    }

    addCharacter()
    {
        for (let i = 0; i < this.data.length; ++i)
        {
            if (this.data[i].length === this.maxCharacters)
            {
                this.data[i] = this.data[i].slice(1);
            }

            this.data[i] += this.characterSet.charAt(Math.floor(Math.random() * this.characterSet.length));
        }
    }

    update(deltaTime)
    {
        this.addCharacterDelayCur -= deltaTime;
        if (this.addCharacterDelayCur <= 0.0)
        {
            this.addCharacterDelayCur = this.addCharacterDelay;
            this.addCharacter();
        }
    }

    render()
    {
        aw.drawText({text:"DATA STREAM", x:this.x, y:this.y + 8, fontName:"courier", fontSize:18, fontStyle:"bold", color:"#000", textBaseline:"middle"})

        for (let i = 0; i < this.data.length; ++i)
        {
            aw.drawText({text:this.data[i].substr(0, this.maxCharacters / 2), x:this.x, y:this.y + 24 + (this.lineHeight * i), fontName:"courier", fontSize:14, fontStyle:"bold", color:foregroundColor, textBaseline:"top"})
        }
    }
}
class System
{
    constructor(name, systemIdx)
    {
        this.name = name;
        this.systemIdx = systemIdx;
        this.curState = "disabled";
        this.offlineTime = 0.0;
        
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
        if (this.isOffline())
        {
            this.offlineTime += deltaTime;
        }
        else
        {
            this.offlineTime = 0.0;
        }
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

    static GetNumSystemsOffline()
    {
        let numSystemsOffline = 0;
        systems.forEach(system =>
        {
            if (system.isOffline() && system.offlineTime >= 1.0)
            {
                numSystemsOffline++;
            }
        });

        return numSystemsOffline;
    }
}
class Comms extends System
{
    constructor()
    {
        super("COMMS", 0);
    }

    update(deltaTime)
    {
        super.update(deltaTime);
    }

    onHelpCommand(shortVersion)
    {
        shell.addMessage("comms: comms [on|off]\n");
        if (!shortVersion)
        {
            shell.addMessage("\n");
            shell.addMessage("Controls the communications system.\n");
            shell.addMessage("When offline, inbound status messages\n");
            shell.addMessage("may not be recieved properly.\n");
            shell.addMessage("\n");
            shell.addMessage("  on      enable communications\n")
            shell.addMessage("  off     disable communications\n")
        }
    }

    onCommand(args)
    {
        if (args[0] === "on")
        {
            this.curState = "online";
            shell.addMessage("");
            statusDisplay.addLine("communications system online");
        }
        else if (args[0] === "off")
        {
            this.curState = "offline";
            shell.addMessage("");
            statusDisplay.addLine("communications system offline");
        }
        else
        {
            this.onHelpCommand(false);
        }
    }
}
class GameController
{
    constructor()
    {

    }

    update(deltaTime)
    {
        
    }
}
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