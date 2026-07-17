import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const careerDir = 'static/career/';

const items = [
    {
        filename: 'careerUzik.png',
        title: 'ST. KABEER ACADEMY',
        subtitle: 'CLASS X - 95.17% (2020-2021)'
    },
    {
        filename: 'careerHetic.png',
        title: 'ST. KABEER ACADEMY',
        subtitle: 'CLASS XII - 92.83% (2022-2023)'
    },
    {
        filename: 'careerImmersiveGarden.png',
        title: 'GRAPHIC ERA UNIVERSITY',
        subtitle: 'B.TECH CSE - 9.05 GPA (2023-2027)'
    },
    {
        filename: 'careerOnlineTeacher.png',
        title: 'MINDEASE AI CHATBOT',
        subtitle: 'MERN STACK &amp; LLM (2025)'
    },
    {
        filename: 'careerFreelancer.png',
        title: 'GRASP DSA ROADMAPS',
        subtitle: 'STREAMLIT &amp; GRAPHS (2025)'
    },
    {
        filename: 'careerIRLTeacher.png',
        title: 'COMMENT NLP AUDITOR',
        subtitle: 'PYTHON &amp; RANDOM FOREST (2026)'
    }
];

async function generate() {
    for (const item of items) {
        const svg = `
        <svg width="512" height="128" viewBox="0 0 512 128" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="black" />
            <text x="50%" y="40%" font-family="Arial, sans-serif" font-size="24" font-weight="900" fill="white" dominant-baseline="middle" text-anchor="middle" letter-spacing="1">${item.title}</text>
            <text x="50%" y="75%" font-family="Arial, sans-serif" font-size="18" font-weight="700" fill="white" dominant-baseline="middle" text-anchor="middle" letter-spacing="1">${item.subtitle}</text>
        </svg>
        `;
        
        const outPath = path.join(careerDir, item.filename);
        await sharp(Buffer.from(svg))
            .png()
            .toFile(outPath);
            
        console.log('Generated:', outPath);
    }
}

generate().catch(console.error);
