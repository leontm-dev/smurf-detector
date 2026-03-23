[powered-image]: https://img.shields.io/badge/Powered%20by-Extension.js-0971fe
[powered-url]: https://extension.js.org

![Powered by Extension.js][powered-image]

# Smurf-Detector Browser Extension

An extension to judge a players smurf-likelihood.

This extension does not aim to harm any players. Be aware that the calculated score and the final judgement is only a calculation based on hypotheses. Please do not be toxic to potential smurfs and don't hate on them, rather hate the game.

## Installation

```bash
git clone https://github.com/leontm-dev/smurf-detector.git
cd smurf-detector
npm install
```

Afterwards you have to add the extension to your browser.

## Commands

### dev

Run the extension in development mode.

```bash
npm run dev
```

### build

Build the extension for production.

```bash
npm run build
```

### preview

Preview the extension in the browser.

```bash
npm run preview
```

## Browser targets

Chromium is the default. You can explicitly target Chrome, Edge, or Firefox:

```bash
# Chromium (default)
npm run dev

# Chrome
npm run dev -- --browser=chrome

# Edge
npm run dev -- --browser=edge

# Firefox
npm run dev -- --browser=firefox
```

## Learn more

Learn more in the [Extension.js docs](https://extension.js.org).
