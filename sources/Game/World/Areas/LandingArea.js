import * as THREE from 'three/webgpu'
import { FontLoader } from 'three/addons/loaders/FontLoader.js'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js'
import fontData from 'three/examples/fonts/helvetiker_bold.typeface.json'
import { color, float, Fn, instancedArray, mix, normalWorld, positionGeometry, step, texture, uniform, uv, vec2, vec3, vec4 } from 'three/tsl'
import { Inputs } from '../../Inputs/Inputs.js'
import { InteractivePoints } from '../../InteractivePoints.js'
import { Area } from './Area.js'
import gsap from 'gsap'
import { MeshDefaultMaterial } from '../../Materials/MeshDefaultMaterial.js'

export class LandingArea extends Area
{
    constructor(model)
    {
        super(model)

        this.localTime = uniform(0)

        this.setLetters()
        this.setKiosk()
        this.setControls()
        this.setBonfire()
        this.setAchievement()
        this.setAiHubKiosk()
    }

    setAiHubKiosk()
    {
        const bonfirePosition = this.references.items.get('bonfireHashes')[0].position;
        const hubPosition = bonfirePosition.clone().add(new THREE.Vector3(2.5, 0.5, 1));

        this.game.interactivePoints.create(
            hubPosition,
            'AI Hub',
            InteractivePoints.ALIGN_RIGHT,
            InteractivePoints.STATE_CONCEALED,
            () =>
            {
                this.game.inputs.interactiveButtons.clearItems()
                this.game.modals.open('ai-hub')
            },
            () =>
            {
                this.game.inputs.interactiveButtons.addItems(['interact'])
            },
            () =>
            {
                this.game.inputs.interactiveButtons.removeItems(['interact'])
            },
            () =>
            {
                this.game.inputs.interactiveButtons.removeItems(['interact'])
            }
        )
    }

    setLetters()
    {
        const name = 'HARSHIT NEGI'
        const lettersReferences = []
        const font = new FontLoader().parse(fontData)
        const letterRotation = new THREE.Quaternion(0, 0.2164396, 0, 0.976296)
        const normalGap = 1
        const wordGap = 1.6
        const totalGap = normalGap * 9 + wordGap
        let gapOffset = 0

        this.lettersShown = false

        const material = new THREE.MeshStandardMaterial({
            color: 0x3d7cff,
            roughness: 0.5,
            metalness: 0.1
        })

        // Start at the left-hand landing anchor, then use an intentional wider
        // gap between the first and last name.
        for(let i = 0; i < name.length; i++)
        {
            const char = name[i]
            if(char === ' ')
            {
                gapOffset += wordGap - normalGap
                continue
            }

            const geometry = new TextGeometry(char, {
                font,
                size: 1.3,
                depth: 0.46,
                curveSegments: 3,
                bevelEnabled: false
            })
            geometry.computeBoundingBox()
            geometry.translate(
                -(geometry.boundingBox.max.x + geometry.boundingBox.min.x) * 0.5,
                -(geometry.boundingBox.max.y + geometry.boundingBox.min.y) * 0.5,
                -0.23
            )

            const mesh = new THREE.Mesh(geometry, material)
            mesh.castShadow = true
            mesh.receiveShadow = true
            mesh.visible = false

            const t = gapOffset / totalGap
            const x = THREE.MathUtils.lerp(-10.8695, 0.4483, t)
            const z = THREE.MathUtils.lerp(5.7250, 0.4473, t)
            const worldPos = new THREE.Vector3(x, -2.5278, z).add(this.model.position)

            const object = this.game.objects.add(
                {
                    model: mesh,
                    parent: this.game.scene,
                    updateMaterials: false
                },
                {
                    type: 'dynamic',
                    position: worldPos,
                    rotation: letterRotation,
                    sleeping: true,
                    mass: 0.25,
                    colliders: [
                        {
                            shape: 'cuboid',
                            parameters: [0.75, 0.75, 0.23],
                            position: { x: 0, y: 0, z: 0 }
                        }
                    ]
                }
            );

            lettersReferences.push(object.visual.object3D)
            gapOffset += normalGap
        }

        this.references.items.set('letters', lettersReferences)

        const references = this.references.items.get('letters')

        for(const reference of references)
        {
            const physical = reference.userData.object.physical
            physical.colliders[0].setActiveEvents(this.game.RAPIER.ActiveEvents.CONTACT_FORCE_EVENTS)
            physical.colliders[0].setContactForceEventThreshold(5)
            physical.onCollision = (force, position) =>
            {
                this.game.audio.groups.get('hitBrick').playRandomNext(force, position)
            }
        }
    }

    setKiosk()
    {
        // Interactive point
        const interactivePoint = this.game.interactivePoints.create(
            this.references.items.get('kioskInteractivePoint')[0].position,
            'Map',
            InteractivePoints.ALIGN_RIGHT,
            InteractivePoints.STATE_CONCEALED,
            () =>
            {
                this.game.inputs.interactiveButtons.clearItems()
                this.game.modals.open('map')
                // interactivePoint.hide()
            },
            () =>
            {
                this.game.inputs.interactiveButtons.addItems(['interact'])
            },
            () =>
            {
                this.game.inputs.interactiveButtons.removeItems(['interact'])
            },
            () =>
            {
                this.game.inputs.interactiveButtons.removeItems(['interact'])
            }
        )

        // this.game.map.items.get('map').events.on('close', () =>
        // {
        //     interactivePoint.show()
        // })
    }

    setControls()
    {
        // Interactive point
        const interactivePoint = this.game.interactivePoints.create(
            this.references.items.get('controlsInteractivePoint')[0].position,
            'Controls',
            InteractivePoints.ALIGN_RIGHT,
            InteractivePoints.STATE_CONCEALED,
            () =>
            {
                this.game.inputs.interactiveButtons.clearItems()
                this.game.menu.open('controls')
                interactivePoint.hide()
            },
            () =>
            {
                this.game.inputs.interactiveButtons.addItems(['interact'])
            },
            () =>
            {
                this.game.inputs.interactiveButtons.removeItems(['interact'])
            },
            () =>
            {
                this.game.inputs.interactiveButtons.removeItems(['interact'])
            }
        )

        // Menu instance
        const menuInstance = this.game.menu.items.get('controls')

        menuInstance.events.on('close', () =>
        {
            interactivePoint.show()
        })

        menuInstance.events.on('open', () =>
        {
            if(this.game.inputs.mode === Inputs.MODE_GAMEPAD)
                menuInstance.tabs.goTo('gamepad')
            else if(this.game.inputs.mode === Inputs.MODE_MOUSEKEYBOARD)
                menuInstance.tabs.goTo('mouse-keyboard')
            else if(this.game.inputs.mode === Inputs.MODE_TOUCH)
                menuInstance.tabs.goTo('touch')
        })
    }

    setBonfire()
    {
        const position = this.references.items.get('bonfireHashes')[0].position

        // Particles
        let particles = null
        {
            const emissiveMaterial = this.game.materials.getFromName('emissiveOrangeRadialGradient')
    
            const count = 30
            const elevation = uniform(5)
            const positions = new Float32Array(count * 3)
            const scales = new Float32Array(count)
    
    
            for(let i = 0; i < count; i++)
            {
                const i3 = i * 3
    
                const angle = Math.PI * 2 * Math.random()
                const radius = Math.pow(Math.random(), 1.5) * 1
                positions[i3 + 0] = Math.cos(angle) * radius
                positions[i3 + 1] = Math.random()
                positions[i3 + 2] = Math.sin(angle) * radius
    
                scales[i] = 0.02 + Math.random() * 0.06
            }
            
            const positionAttribute = instancedArray(positions, 'vec3').toAttribute()
            const scaleAttribute = instancedArray(scales, 'float').toAttribute()
    
            const material = new THREE.SpriteNodeMaterial()
            material.outputNode = emissiveMaterial.outputNode
    
            const progress = float(0).toVar()
    
            material.positionNode = Fn(() =>
            {
                const newPosition = positionAttribute.toVar()
                progress.assign(newPosition.y.add(this.localTime.mul(newPosition.y)).fract())
    
                newPosition.y.assign(progress.mul(elevation))
                newPosition.xz.addAssign(this.game.wind.direction.mul(progress))
    
                const progressHide = step(0.8, progress).mul(100)
                newPosition.y.addAssign(progressHide)
                
                return newPosition
            })()
            material.scaleNode = Fn(() =>
            {
                const progressScale = progress.remapClamp(0.5, 1, 1, 0)
                return scaleAttribute.mul(progressScale)
            })()
    
            const geometry = new THREE.CircleGeometry(0.5, 8)
    
            particles = new THREE.Mesh(geometry, material)
            particles.visible = false
            particles.position.copy(position)
            particles.count = count
            this.game.scene.add(particles)
        }

        // Hashes
        {
            const alphaNode = Fn(() =>
            {
                const baseUv = uv(1)
                const distanceToCenter = baseUv.sub(0.5).length()
    
                const voronoi = texture(
                    this.game.noises.voronoi,
                    baseUv
                ).g
    
                voronoi.subAssign(distanceToCenter.remap(0, 0.5, 0.3, 0))
    
                return voronoi
            })()
    
            const material = new MeshDefaultMaterial({
                colorNode: color(0x6F6A87),
                alphaNode: alphaNode,
                hasWater: false,
                hasLightBounce: false
            })
    
            const mesh = this.references.items.get('bonfireHashes')[0]
            mesh.material = material
        }

        // Burn
        const burn = this.references.items.get('bonfireBurn')[0]
        burn.visible = false

        // Interactive point
        this.game.interactivePoints.create(
            this.references.items.get('bonfireInteractivePoint')[0].position,
            'Res(e)t',
            InteractivePoints.ALIGN_RIGHT,
            InteractivePoints.STATE_CONCEALED,
            () =>
            {
                this.game.reset()

                gsap.delayedCall(2, () =>
                {
                    // Bonfire
                    particles.visible = true
                    burn.visible = true
                    this.game.ticker.wait(2, () =>
                    {
                        particles.geometry.boundingSphere.center.y = 2
                        particles.geometry.boundingSphere.radius = 2
                    })

                    // Sound
                    this.game.audio.groups.get('campfire').items[0].positions.push(position)
                })
            },
            () =>
            {
                this.game.inputs.interactiveButtons.addItems(['interact'])
            },
            () =>
            {
                this.game.inputs.interactiveButtons.removeItems(['interact'])
            },
            () =>
            {
                this.game.inputs.interactiveButtons.removeItems(['interact'])
            }
        )
    }

    setAchievement()
    {
        this.events.on('boundingIn', () =>
        {
            this.game.achievements.setProgress('areas', 'landing')
        })
        this.events.on('boundingOut', () =>
        {
            this.game.achievements.setProgress('landingLeave', 1)
        })
    }

    update()
    {
        this.localTime.value += this.game.ticker.deltaScaled * 0.1

        // The title is part of the full-world reveal, triggered by clicking
        // the car in the intro. It must stay hidden during the compact intro.
        if(!this.lettersShown && this.game.reveal.step === 2)
        {
            this.lettersShown = true

            for(const letter of this.references.items.get('letters'))
                letter.visible = true
        }
    }
}
