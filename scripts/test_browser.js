import puppeteer from 'puppeteer-core';
import fs from 'fs';

const paths = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
];

let executablePath = '';
for (const p of paths) {
    if (fs.existsSync(p)) {
        executablePath = p;
        break;
    }
}

if (!executablePath) {
    console.error('Could not find Chrome or Edge executable!');
    process.exit(1);
}

async function run() {
    const browser = await puppeteer.launch({
        executablePath,
        headless: true,
        defaultViewport: { width: 1280, height: 720 }
    });
    
    const page = await browser.newPage();
    
    page.on('console', msg => {
        console.log(`[CONSOLE ${msg.type().toUpperCase()}]:`, msg.text());
    });
    
    page.on('pageerror', err => {
        console.error('[BROWSER ERROR]:', err.stack || err.message);
    });

    page.on('requestfailed', request => {
        console.log(`[REQUEST FAILED]: ${request.url()} - ${request.failure()?.errorText || 'Unknown error'}`);
    });
    
    console.log('Navigating to http://localhost:5173/...');
    try {
        await page.goto('http://localhost:5173/', { waitUntil: 'load', timeout: 15000 });
        
        console.log('Waiting 10 seconds for initial file load...');
        await new Promise(resolve => setTimeout(resolve, 10000));
        
        console.log('Clicking the screen to dismiss loading overlay...');
        await page.click('body');
        
        console.log('Waiting 2 seconds for start overlay to render...');
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        console.log('Pressing Enter key to start the game...');
        await page.keyboard.press('Enter');
        
        console.log('Waiting 10 seconds for physics to settle and reveal camera to complete...');
        await new Promise(resolve => setTimeout(resolve, 10000));
        
        const screenshotPath = 'C:\\Users\\negih\\.gemini\\antigravity\\brain\\b6c81f25-4084-44d2-945c-2df1ec3734c5\\screenshot.png';
        await page.screenshot({ path: screenshotPath });
        console.log('Screenshot saved to:', screenshotPath);
        
        await page.evaluate(() => {
            console.log('--- browser telemetry start ---');
            const game = window.game;
            if (game && game.world && game.world.areas && game.world.areas.landing) {
                const landing = game.world.areas.landing;
                console.log('Landing model position:', JSON.stringify(landing.model.position));
                const letters = landing.references.items.get('letters');
                console.log('Letters references count:', letters ? letters.length : 'undefined');
                if (letters) {
                    letters.forEach((l, idx) => {
                        const obj = l.userData?.object;
                        if (obj) {
                            console.log(`Letter [${idx}] pos:`, JSON.stringify(obj.visual?.object3D?.position));
                        }
                    });
                }
            } else {
                console.log('Game or landing area not fully ready');
            }
            console.log('--- browser telemetry end ---');
        });
        
    } catch (e) {
        console.error('Navigation or execution error:', e);
    }
    
    await browser.close();
}

run().catch(console.error);
