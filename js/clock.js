class Clock {
    constructor(options) {
      this._el = $.el('#clock');
      this._elIp = $.el('#ip');

      this._el.addEventListener('click', options.toggleHelp && clearInterval(timerID));
      this._elIp.addEventListener('click', options.toggleHelp && clearInterval(timerID));
      var timerID = setInterval(function() {
        this._start();
      }, 60 * 1000); 
    }
  
    async _start() {
      const response = await fetch("https://tid.wwn.se/");
      const time = await response.json();

      this._el.innerHTML = `${time.currentDateTime}`;
      this._el.setAttribute('datetime', time.currentDateTime);

      this._elIp.innerHTML = `${time.ip}`;
    }
  }
