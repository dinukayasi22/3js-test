import * as THREE from 'three'
import './style.css'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import  gsap  from 'gsap'
//scene
const scene = new THREE.Scene()

//create our sphere
const geometry = new THREE.SphereGeometry( 3, 64, 32 )
const material = new THREE.MeshPhongMaterial( { color: "#808000", roughness: 1 } )
const planet = new THREE.Mesh(geometry, material)
scene.add( planet )

//sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
}

//light
const light = new THREE.PointLight(0xffffff, 100, 500)
light.position.set(0, 10, 10)
light.intensity = 450
scene.add(light)


//camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100 )
camera.position.z = 20
scene.add(camera)


//renderer
const canvas = document.querySelector('.webgl')
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(2)
renderer.render(scene, camera)


//Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enablePan = false
controls.enableZoom = false
controls.autoRotate = true
controls.autoRotateSpeed = 2

//resize
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    camera.updateProjectionMatrix()
    camera.aspect = sizes.width / sizes.height
    renderer.setSize(sizes.width, sizes.height)
})

const loop = () => {
    controls.update()
    renderer.render(scene, camera);
    window.requestAnimationFrame(loop);
}
loop()

//Time line
const time = gsap.timeline({defaults:{duration:0.65}})
time.fromTo(planet.scale, { z:0, x:0, y:0 }, { z: 1, x: 1, y: 1 })
time.fromTo("nav", {y:"-80%"}, {y:"0%"})
time.fromTo("#heading", {opacity:0}, {opacity:1})

//
let mouseDown = false
let rgb = []

window.addEventListener("mousedown", () => (mouseDown = true))
window.addEventListener("mouseup", () => (mouseDown = false))

window.addEventListener("mousemove", (e) => {
    if(mouseDown){
        rgb = [
            Math.round((e.pageX / sizes.width)*225),
            Math.round((e.pageY /sizes.height)*225),
            150,
        ]
        let color = new THREE.Color(`rgb(${rgb.join(",")})`)
        gsap.to(planet.material.color, {
            r: color.r,
            g: color.g,
            b: color.b,    
        })
    }
})

geometry.scale(sphereAspect, 1, 1)