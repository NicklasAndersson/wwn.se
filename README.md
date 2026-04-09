# wwn.se

A custom browser startpage built with vanilla HTML, CSS, and JavaScript. It provides a search bar with keyboard-driven command shortcuts, auto-suggestions, a clock, and quick-access links to frequently used services.

## Tech Stack

- **HTML5** – single-page layout (`index.html`)
- **CSS3** – styling with CSS custom properties for theming (`css/style.css`)
- **Vanilla JavaScript (ES6+)** – no frameworks, no build step
- **External API** – DuckDuckGo search suggestions (fetched client-side via JSONP)
- **Storage** – `localStorage` for persisting user preferences

There are no npm dependencies, bundlers, or build tools. The site is entirely static.

## Project Structure

```
.
├── index.html              # Entry point – loads styles and scripts
├── css/
│   └── style.css           # All styles (includes normalize + custom)
├── js/
│   ├── config.js           # Commands, suggestions, and settings
│   ├── index.js            # Bootstraps all modules using CONFIG
│   ├── body.js             # DOM utility helpers ($)
│   ├── clock.js            # Clock display (time + IP)
│   ├── form.js             # Search form input handling and navigation
│   ├── help.js             # Help overlay with command listing
│   ├── influencers.js      # Suggestion sources (Commands, DuckDuckGo, History, Default)
│   ├── queryParser.js      # Parses user input into command + query
│   ├── suggester.js        # Manages and renders search suggestions
│   └── svg-inject.min.js   # Third-party SVG injection utility
├── assets/
│   └── fonts/              # Custom web fonts
└── LICENSE                 # Unlicense (public domain)
```

## Running Locally

No install or build is required. Open `index.html` directly in a browser:

```sh
# Using Python's built-in server
python3 -m http.server 8000

# Or with Node.js (npx)
npx serve .
```

Then visit `http://localhost:8000`.

> **Note:** DuckDuckGo suggestions require an HTTP server; they will not load from `file://` URLs due to CORS restrictions.

## Configuration

All settings live in `js/config.js` inside the `CONFIG` object.

### Commands

Each command has the following properties:

| Property      | Description                                              | Required |
|---------------|----------------------------------------------------------|----------|
| `category`    | Group shown in the help menu (omit to hide from help)    | No       |
| `name`        | Display name                                             | Yes      |
| `key`         | Shortcut key (e.g. `m` for Mail). `*` is the fallback   | Yes      |
| `url`         | Base URL to navigate to                                  | Yes      |
| `search`      | Search path appended to `url`; `{}` is the query placeholder | No   |
| `color`       | Background color/gradient shown when the command matches  | No       |
| `icon`        | *(unused)* Icons are now auto-fetched via Google Favicon API | No       |
| `quickLaunch` | Include in quick-launch (`q!`) batch open                 | No       |

Example – add a command for GitHub:

```js
{
  category: 'Dev',
  name: 'GitHub',
  key: 'g',
  url: 'https://github.com',
  search: '/search?q={}',
  color: '#333',
  icon: 'github',
  quickLaunch: true,
}
```

Usage: type `g:react` to search GitHub for "react", or just `g` to open github.com.

### Suggestion Influencers

The `influencers` array controls where suggestions come from and their priority:

| Influencer   | Source                                     |
|--------------|--------------------------------------------|
| `Commands`   | Matches against configured command keys    |
| `Default`    | Static suggestions defined in `defaultSuggestions` |
| `DuckDuckGo` | Live search suggestions from DuckDuckGo   |
| `History`    | Previously entered queries (localStorage)  |

Adjust the `limit` for each influencer to control how many suggestions it contributes.

### Other Settings

| Setting              | Default | Description                                          |
|----------------------|---------|------------------------------------------------------|
| `suggestions`        | `true`  | Enable or disable search suggestions                 |
| `suggestionsLimit`   | `4`     | Maximum total suggestions shown                      |
| `instantRedirect`    | `false` | Redirect immediately when a key matches              |
| `newTab`             | `false` | Open results in a new tab                            |
| `colors`             | `true`  | Dynamic background colors matching commands           |
| `invertedColors`     | `false` | Invert the color theme                               |
| `showKeys`           | `true`  | Show shortcut keys instead of icons                  |
| `searchDelimiter`    | `:`     | Separator between key and search query (e.g. `g:query`) |
| `pathDelimiter`      | `/`     | Separator between key and path (e.g. `r/r/startpages`) |
| `clockDelimiter`     | ` `     | Separator between hours and minutes on the clock     |
| `twentyFourHourClock`| `true`  | Use 24-hour clock format                             |
| `iconExtension`      | `png`   | *(unused)* Icons now fetched via Google Favicon API |

## URL Parameters

Append these query parameters to the page URL to control behavior:

| Parameter              | Description                                              |
|------------------------|----------------------------------------------------------|
| `?q=<query>`           | Submit a search query on load                            |
| `?hideclock`           | Hide the clock display                                   |
| `?hideip`              | Hide the IP address                                      |
| `?refresh=<duration>`  | Set the clock refresh duration (ISO 8601, e.g. `PT1H`)  |
| `?helpParams`          | Show an overlay listing all URL parameters and search commands |

Parameters can be combined: `?hideclock&hideip`.

> **Tip:** Visit the page with `?helpParams` to see a quick-reference overlay of all parameters and search commands directly in the browser.

## Special Commands

These are typed directly into the search bar:

| Command    | Action                                                  |
|------------|---------------------------------------------------------|
| `?`        | Toggle the help overlay listing all commands            |
| `q!`       | Quick-launch all commands with `quickLaunch: true`      |
| `invert!`  | Toggle inverted color theme (saved to localStorage)     |
| `keys!`    | Toggle between showing keys or icons (saved to localStorage) |
| `<n>!`     | Launch all commands in category number `<n>`            |

Press **Ctrl+Enter** to append `.com` to the current query before navigating.

## Deployment

This is a static site with no server-side requirements. Deploy by serving the repository contents from any static hosting provider:

- **GitHub Pages** – push to a `gh-pages` branch or enable Pages on the main branch
- **Netlify / Vercel / Cloudflare Pages** – connect the repository; no build command needed
- **Traditional web server** – copy all files to the document root

## License

This project is released into the public domain under the [Unlicense](LICENSE).
