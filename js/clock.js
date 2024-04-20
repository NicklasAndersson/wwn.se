class Clock {
    constructor(options) {
      this._el = $.el('#clock');
      //this._delimiter = options.delimiter;
      //this._twentyFourHourClock = options.twentyFourHourClock;
      //this._setTime = this._setTime.bind(this);
      this._el.addEventListener('click', options.toggleHelp);
      this._start();
    }
  
    async _start() {
      const response = await fetch("https://wwn-se-time.wwn.workers.dev/");
      const time = await response.json();

      this._el.innerHTML = `${time.currentDateTime}`;
      this._el.setAttribute('datetime', date.toTimeString());
    }
  }
