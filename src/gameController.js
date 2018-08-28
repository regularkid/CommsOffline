class GameController
{
    constructor()
    {
        this.addSystemDelay = 30;
        this.curAddSystemTimer = 5.0;

        this.nextSystemOfflineTimer = 0.0;
        this.nextSystemOfflineDelayMin = 5.0;
        this.nextSystemOfflineDelayMax = 15.0;
        this.setNextSystemOfflineTimer();
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
                    let randSystemIdx = Math.floor(Math.random() * systems.length);
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