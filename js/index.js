// Get invertedColors preference from cookies
CONFIG.invertedColors = localStorage.getItem('invertColorCookie') ?
  JSON.parse(localStorage.getItem('invertColorCookie')) :
  CONFIG.invertedColors;

// Get showKeys preference from cookies
CONFIG.showKeys = localStorage.getItem('showKeysCookie') ?
  JSON.parse(localStorage.getItem('showKeysCookie')) :
  CONFIG.showKeys;

// Prefetch favicon icons for all commands
CONFIG.commands.forEach(command => {
  if (command.url) {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = `https://favicon.wwn.se/blob/${command.url}`;
    link.as = 'image';
    document.head.appendChild(link);
  }
});

const queryParser = new QueryParser({
  commands: CONFIG.commands,
  pathDelimiter: CONFIG.pathDelimiter,
  searchDelimiter: CONFIG.searchDelimiter,
});

const influencers = CONFIG.influencers.map(influencerConfig => {
  return new {
    Default: DefaultInfluencer,
    Commands: CommandsInfluencer,
    DuckDuckGo: DuckDuckGoInfluencer,
    History: HistoryInfluencer,
  } [influencerConfig.name]({
    defaultSuggestions: CONFIG.defaultSuggestions,
    limit: influencerConfig.limit,
    parseQuery: queryParser.parse,
    commands: CONFIG.commands
  });
});

const suggester = new Suggester({
  enabled: CONFIG.suggestions,
  influencers,
  limit: CONFIG.suggestionsLimit,
});

const help = new Help({
  commands: CONFIG.commands,
  newTab: CONFIG.newTab,
  suggester,
  invertedColors: CONFIG.invertedColors,
  showKeys: CONFIG.showKeys
});

const form = new Form({
  colors: CONFIG.colors,
  instantRedirect: CONFIG.instantRedirect,
  newTab: CONFIG.newTab,
  parseQuery: queryParser.parse,
  suggester,
  toggleHelp: help.toggle,
  quickLaunch: help.launch,
  categoryLaunch: help.launchCategory,
  invertedColors: CONFIG.invertedColors,
  showKeys: CONFIG.showKeys
});

new Clock({
  delimiter: CONFIG.clockDelimiter,
  toggleHelp: help.toggle,
  twentyFourHourClock: CONFIG.twentyFourHourClock,
});

if (new URLSearchParams(window.location.search).has('helpParams')) {
  const paramsEl = $.el('#help-params');
  paramsEl.innerHTML = `
    <div class="help-params-content">
      <h2 class="help-params-title">URL Parameters</h2>
      <ul class="help-params-list">
        <li><span class="help-params-key">?q=&lt;query&gt;</span> <span class="help-params-desc">Submit a search query</span></li>
        <li><span class="help-params-key">?hideclock</span> <span class="help-params-desc">Hide the clock display</span></li>
        <li><span class="help-params-key">?hideip</span> <span class="help-params-desc">Hide the IP address</span></li>
        <li><span class="help-params-key">?refresh=&lt;duration&gt;</span> <span class="help-params-desc">Clock refresh duration (ISO 8601, e.g. PT1H)</span></li>
        <li><span class="help-params-key">?helpParams</span> <span class="help-params-desc">Show this help</span></li>
      </ul>
      <h2 class="help-params-title">Search Commands</h2>
      <ul class="help-params-list">
        <li><span class="help-params-key">?</span> <span class="help-params-desc">Show commands help</span></li>
        <li><span class="help-params-key">&lt;key&gt;:&lt;search&gt;</span> <span class="help-params-desc">Search using a command (e.g. g:query)</span></li>
        <li><span class="help-params-key">&lt;key&gt;/&lt;path&gt;</span> <span class="help-params-desc">Navigate to path (e.g. g/pulls)</span></li>
        <li><span class="help-params-key">q!</span> <span class="help-params-desc">Quick launch all starred commands</span></li>
        <li><span class="help-params-key">&lt;N&gt;!</span> <span class="help-params-desc">Launch all commands in category N</span></li>
        <li><span class="help-params-key">invert!</span> <span class="help-params-desc">Toggle inverted colors</span></li>
        <li><span class="help-params-key">keys!</span> <span class="help-params-desc">Toggle key/icon display</span></li>
      </ul>
    </div>`;
  $.bodyClassAdd('help-params');

  document.addEventListener('keydown', e => {
    if ($.key(e) === 'escape') $.bodyClassRemove('help-params');
  });
}