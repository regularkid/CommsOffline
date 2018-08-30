class GameController
{
    constructor()
    {
        this.addSystemDelay = 2;
        this.curAddSystemTimer = 2.0;

        this.nextSystemOfflineDelayMin = 7.0;
        this.nextSystemOfflineDelayMax = 15.0;
        this.setNextSystemOfflineTimer();
        this.nextSystemOfflineTimer += this.curAddSystemTimer;
    }

    update(deltaTime)
    {
        this.nextSystemOfflineTimer -= deltaTime;
        if (this.nextSystemOfflineTimer <= 0.0)
        {
            this.setNextSystemOfflineTimer();

            if (System.GetNumSystemsOffline() <= systems.length)
            {
                let timeout = 100;
                while (--timeout > 0)
                {
                    let randSystemIdx = 1;//Math.floor(Math.random() * systems.length);
                    if (systems[randSystemIdx].isOnline())
                    {
                        systems[randSystemIdx].setOffline();
                        break;
                    }
                }
            }
        }

        this.curAddSystemTimer -= deltaTime;
        if (this.curAddSystemTimer <= 0.0)
        {
            this.curAddSystemTimer = this.addSystemDelay;
            for (let i = 0; i < systems.length; i++)
            {
                if (systems[i].isDisabled())
                {
                    systems[i].setOnline();
                    if (i < systems.length - 1)
                    {
                        statusDisplay.addLine(`Next system operational in ${this.curAddSystemTimer} seconds`);
                    }
                    break;
                }
            }
        }
    }

    setNextSystemOfflineTimer()
    {
        this.nextSystemOfflineTimer = this.nextSystemOfflineDelayMin + (Math.random() * (this.nextSystemOfflineDelayMax - this.nextSystemOfflineDelayMin));
    }
}