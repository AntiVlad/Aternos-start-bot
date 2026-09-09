# Aternos Start Bot

A WhatsApp bot powered by `whatsapp-web.js` and `puppeteer-extra-plugin-stealth` that allows players to start an Aternos Minecraft server on-demand by sending a WhatsApp message.

## Features

- **On-Demand Server Startup**: Listens for WhatsApp trigger commands and automatically spins up your Aternos Minecraft server.
- **Bot Evasion**: Employs `puppeteer-extra-plugin-stealth` to bypass automated bot checks and Cloudflare challenges.
- **Queue Handling**: Automatically confirms queue placement and clicks the server start button.
- **Session Persistence**: Saves WhatsApp authentication credentials locally via `LocalAuth`.

---

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- Google Chrome installed locally
- An active [Aternos](https://aternos.org/) account hosting your Minecraft server
- An active WhatsApp account on mobile for QR authentication

---

## Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/AntiVlad/Aternos-start-bot.git
   cd Aternos-start-bot
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Chrome Executable Path**:
   In `mc.js`, verify the path to your Google Chrome binary:
   - **Linux**: `/usr/bin/google-chrome-stable`
   - **Windows**: `C:\Program Files\Google\Chrome\Application\chrome.exe`

4. **Start the bot**:
   ```bash
   node mc.js
   ```

5. **Link WhatsApp**:
   Scan the terminal QR code using WhatsApp on your phone (**Settings** > **Linked Devices** > **Link a Device**).

---

## Usage

Once connected, authorized WhatsApp contacts can send the configured command message (e.g. `!start`) to trigger the headless browser session, log in to Aternos, and start the Minecraft server.

---

## License

This project is open source and available under the ISC License.
