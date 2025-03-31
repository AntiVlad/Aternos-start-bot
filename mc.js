const qrcode = require('qrcode-terminal');
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const fs= require('fs')
// const puppeteer = require('puppeteer');
const puppeteer = require('puppeteer-extra')

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())
const client = new Client({
    authStrategy: new LocalAuth(),
    webVersion: '2.2412.50',
    puppeteer: { headless: true },
    // ffmpegPath: '../ffmpeg.exe',
    puppeteer: {headless: true,
        args: ['--no-sandbox'],
        executablePath:'/usr/bin/google-chrome-stable'
    }
});


// const client = new Client({
//     authStrategy: new LocalAuth(),
//     puppeteer: { headless: true },
//     ffmpegPath: '../ffmpeg.exe',
//     puppeteer: {
//       executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
//   }
// });


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



client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Client is ready!');
});
client.initialize();

client.on('message', async (msg) => {

    
    const chat = await msg.getChat(); 
    if(msg.body === `/status`){
        try{
            initializeBrowser("https://aternos.org/server/")

            checkServerStatus("https://aternos.org/server/")
            let servstat = await checkServerStatus()
            // console.log(servstat)
            msg.reply(`Server Status: ${servstat}`)
        }catch(e){
            console.log(e)
        }    
    }
    if(msg.body === `/start`){
        try{
            //if status==online{
                // break
            //}
            if(await checkServerStatus()==="Online"){
                msg.reply("Server already started")
                throw new Error("server already started");
            }else if(await checkServerStatus()==="Offline"){
                startServer()
                msg.reply("Starting server ...")
            }else{
                msg.reply("Server already started")
            }

        }catch(e){
            console.log(e)
        }    
    }
    
});    
