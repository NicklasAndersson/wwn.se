class Clock {
    constructor(options) {
      this._el = $.el('#clock');
      this._elIp = $.el('#ip');
      this._maxUpdates = 10;
      this._updateCount = 0;

      const params = new URLSearchParams(window.location.search);

      this._hideClock = params.has('hideclock');
      this._hideIp = params.has('hideip');

      if (this._hideClock) this._el.style.display = 'none';
      if (this._hideIp) this._elIp.style.display = 'none';

      const refreshParam = params.get('refresh');
      if (refreshParam) {
        const durationMs = this._parseISO8601Duration(refreshParam);
        if (durationMs > 0) {
          this._maxUpdates = Math.max(1, Math.ceil(durationMs / 60000));
        }
      }

      this._el.addEventListener('click', options.toggleHelp);
      this._elIp.addEventListener('click', () => {
        navigator.clipboard.writeText(this._elIp.textContent.trim());
      });

      if (!this._hideClock || !this._hideIp) {
        this._update();
      }
    }

    _parseISO8601Duration(duration) {
      const match = duration.match(
        /^P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?)?$/
      );
      if (!match) return 0;
      const [, years, months, days, hours, minutes, seconds] = match;
      return (
        (parseInt(years || 0) * 365.25 * 24 * 60 * 60 * 1000) +
        (parseInt(months || 0) * 30.44 * 24 * 60 * 60 * 1000) +
        (parseInt(days || 0) * 24 * 60 * 60 * 1000) +
        (parseInt(hours || 0) * 60 * 60 * 1000) +
        (parseInt(minutes || 0) * 60 * 1000) +
        (parseFloat(seconds || 0) * 1000)
      );
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

      if (!this._hideClock) {
        this._el.innerHTML = `${time.currentDateTime}`;
        this._el.setAttribute('datetime', time.currentDateTime);
      }

      if (!this._hideIp) {
        this._elIp.innerHTML = `${time.ip}`;
      }

      if (this._updateCount >= this._maxUpdates) {
        this._el.style.color = 'darkred';
      } else {
        this._scheduleNextUpdate();
      }
    }
  }
