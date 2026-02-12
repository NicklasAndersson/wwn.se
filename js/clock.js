class Clock {
    constructor(options) {
      this._el = $.el('#clock');
      this._elIp = $.el('#ip');
      this._maxUpdates = 10;
      this._updateCount = 0;

      this._el.addEventListener('click', options.toggleHelp);
      this._elIp.addEventListener('click', options.toggleHelp);

      this._update();
      this._interval = setInterval(() => this._update(), 31000);
    }
  
    async _update() {
      if (this._updateCount >= this._maxUpdates) {
        clearInterval(this._interval);
        return;
      }

      this._updateCount++;

      const response = await fetch("https://tid.wwn.se/");
      const time = await response.json();

      this._el.innerHTML = `${time.currentDateTime}`;
      this._el.setAttribute('datetime', time.currentDateTime);

      this._elIp.innerHTML = `${time.ip}`;
    }
  }
