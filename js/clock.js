class Clock {
    constructor(options) {
      this._el = $.el('#clock');
      this._elIp = $.el('#ip');
      this._maxUpdates = 10;
      this._updateCount = 0;

      this._el.addEventListener('click', options.toggleHelp);
      this._elIp.addEventListener('click', () => {
        navigator.clipboard.writeText(this._elIp.textContent.trim());
      });

      this._update();
    }
  
    _scheduleNextUpdate() {
      if (this._updateCount >= this._maxUpdates) return;
      const now = new Date();
      const msUntilNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
      setTimeout(() => this._update(), msUntilNextMinute + 500);
    }

    async _update() {
      if (this._updateCount >= this._maxUpdates) return;

      this._updateCount++;

      const response = await fetch("https://tid.wwn.se/");
      const time = await response.json();

      this._el.innerHTML = `${time.currentDateTime}`;
      this._el.setAttribute('datetime', time.currentDateTime);

      this._elIp.innerHTML = `${time.ip}`;

      if (this._updateCount >= this._maxUpdates) {
        this._el.style.color = 'darkred';
      } else {
        this._scheduleNextUpdate();
      }
    }
  }
