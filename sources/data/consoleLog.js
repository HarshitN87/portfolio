import * as THREE from 'three/webgpu'

const text = `
██╗  ██╗ █████╗ ██████╗ ███████╗██╗  ██╗██╗████████╗   ███╗   ██╗███████╗ ██████╗ ██╗
██║  ██║██╔══██╗██╔══██╗██╔════╝██║  ██║██║╚══██╔══╝   ████╗  ██║██╔════╝██╔════╝ ██║
███████║███████║██████╔╝███████╗███████║██║   ██║      ██╔██╗ ██║█████╗  ██║  ███╗██║
██╔══██║██╔══██║██╔══██╗╚════██║██╔══██║██║   ██║      ██║╚██╗██║██╔══╝  ██║   ██║██║
██║  ██║██║  ██║██║  ██║███████║██║  ██║██║   ██║      ██║ ╚████║███████╗╚██████╔╝██║
╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝   ╚═╝      ╚═╝  ╚═══╝╚══════╝ ╚═════╝ ╚═╝

╔═ Intro ═══════════════╗
║ Welcome to Harshit Negi's interactive 3D Portfolio!
║ Drive around to explore projects, skills, education, and find secrets.
║ Driven by code, curiosity, and full-stack engineering.
╚═══════════════════════╝

╔═ Socials ═══════════════╗
║ Mail     ⇒ negiharshit89@gmail.com
║ Phone    ⇒ +91 8979579812
║ GitHub   ⇒ https://github.com/HarshitN87
║ LinkedIn ⇒ https://linkedin.com/in/harshit-negi-95a858280
╚═══════════════════════╝

╔═ Debug ═══════════════╗
║ Access debug mode by adding #debug at the end of the URL and reloading.
║ Press [V] to toggle the free camera.
╚═══════════════════════╝

╔═ Tech Stack ══════════╗
║ Physics library  ⇒ Rapier (https://rapier.rs/)
║ Audio library    ⇒ Howler.js (https://howlerjs.com/)
║ 3D Engine        ⇒ Three.js (https://threejs.org/, release: ${THREE.REVISION}) using WebGPU/TSL
╚═══════════════════════╝
`
let finalText = ''
let finalStyles = []
const stylesSet = {
    letter: 'color: #ffffff; font: 400 1em monospace;',
    pipe: 'color: #D66FFF; font: 400 1em monospace;',
}
let currentStyle = null
for(let i = 0; i < text.length; i++)
{
    const char = text[i]

    const style = char.match(/[╔║═╗╚╝╔╝]/) ? 'pipe' : 'letter'
    if(style !== currentStyle)
    {
        currentStyle = style
        finalText += '%c'

        finalStyles.push(stylesSet[currentStyle])
    }
    finalText += char
}

export default [finalText, ...finalStyles]