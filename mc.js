const { Client, GatewayIntentBits } = require('discord.js');
const fs= require('fs')
// const puppeteer = require('puppeteer');
const puppeteer = require('puppeteer-extra')

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent
    ]
});


let browser;
let page;

async function initializeBrowser(url) {
    try{
        if (!browser) {
            browser = await puppeteer.launch({ headless: false });
            page = await browser.newPage();
            const cookies = JSON.parse(fs.readFileSync('cookies.json', 'utf8'));
            await page.setCookie(...cookies);
            await page.goto(url, { waitUntil: 'networkidle2' });
        } else {
            await page.reload({ waitUntil: 'networkidle2' });
        }
    }catch(e){
        console.log(e)
    }
}

async function checkServerStatus() {
    try {
        await page.waitForSelector('.statuslabel-label');

        const serverStatus = await page.$eval(
            '.statuslabel-label',
            (element) => element.textContent.trim()
        );

        console.log(`Server status: ${serverStatus}`);
        return serverStatus;
    } catch (error) {
        console.error('Error checking server status:', error);
        return null;
    }
}

async function startServer() {
    try {
        await page.waitForSelector('#start');

        await page.click('#start');
        console.log('Start button clicked. The server is starting...');
    } catch (error) {
        console.error('Error starting the server:', error);
    }
}



client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (!message.guild) return;

    if (message.content === '/status') {
        try {
            await initializeBrowser('https://aternos.org/server/');
            const status = await checkServerStatus();
            if (status) {
                message.reply(`Server Status: **${status}**`);
            } else {
                message.reply('Could not determine the server status.');
            }
        } catch (e) {
            console.error(e);
            message.reply('Error while checking server status.');
        }
    }

    if (message.content === '/start') {
        try {
            await initializeBrowser('https://aternos.org/server/');

            const status = await checkServerStatus();
            if (status === 'Online') {
                message.reply('Server is already online.');
            } else if (status === 'Offline') {
                await startServer();
                message.reply('Starting server...');
            } else {
                message.reply(`Current status: ${status}.`);
            }
        } catch (e) {
            console.error(e);
            message.reply('Error while trying to start the server.');
        }
    }
});


client.login('YOUR BOT TOKEN');