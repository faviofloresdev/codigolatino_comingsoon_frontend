"use client"

import { useEffect, useRef } from "react"

export function ParticleBackground() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let animationId = 0
    let cleanup = () => {}

    // Load Three.js and postprocessing modules dynamically (client-only).
    Promise.all([
      import("three"),
      import("three/examples/jsm/postprocessing/EffectComposer.js"),
      import("three/examples/jsm/postprocessing/RenderPass.js"),
      import("three/examples/jsm/postprocessing/UnrealBloomPass.js"),
    ]).then(([THREE, { EffectComposer }, { RenderPass }, { UnrealBloomPass }]) => {
      const scene = new THREE.Scene()
      scene.fog = new THREE.FogExp2(0x000000, 0.035)

      const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100)
      camera.position.z = 12

      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: false,
        powerPreference: "high-performance",
      })
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setClearColor(0x000000, 0)
      container.appendChild(renderer.domElement)

      const composer = new EffectComposer(renderer)
      composer.addPass(new RenderPass(scene, camera))
      const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        1.2,
        0.5,
        0.2,
      )
      composer.addPass(bloomPass)

      const particlesCount = 10000
      const geometry = new THREE.BufferGeometry()
      const posArray = new Float32Array(particlesCount * 3)
      const colorsArray = new Float32Array(particlesCount * 3)
      const sizesArray = new Float32Array(particlesCount)
      const randomArray = new Float32Array(particlesCount)

      const colorPalette = [
        new THREE.Color(0x6366f1),
        new THREE.Color(0xa855f7),
        new THREE.Color(0x3b82f6),
        new THREE.Color(0x14b8a6),
      ]

      for (let i = 0; i < particlesCount; i++) {
        const radius = Math.random() * 25
        const theta = Math.random() * Math.PI * 2
        const phi = Math.acos(Math.random() * 2 - 1)

        posArray[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
        posArray[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
        posArray[i * 3 + 2] = radius * Math.cos(phi)

        const c = colorPalette[Math.floor(Math.random() * colorPalette.length)]
        colorsArray[i * 3] = c.r
        colorsArray[i * 3 + 1] = c.g
        colorsArray[i * 3 + 2] = c.b

        sizesArray[i] = Math.random() * 2.0 + 0.5
        randomArray[i] = Math.random()
      }

      geometry.setAttribute("position", new THREE.BufferAttribute(posArray, 3))
      geometry.setAttribute("color", new THREE.BufferAttribute(colorsArray, 3))
      geometry.setAttribute("aSize", new THREE.BufferAttribute(sizesArray, 1))
      geometry.setAttribute("aRandom", new THREE.BufferAttribute(randomArray, 1))

      const vertexShader = `
        uniform float uTime;
        attribute float aSize;
        attribute float aRandom;
        varying vec3 vColor;
        varying float vAlpha;
        void main() {
            vColor = color;
            vec3 pos = position;
            float noise = sin(pos.x * 0.5 + uTime * 0.5) * cos(pos.y * 0.5 + uTime * 0.3) * sin(pos.z * 0.5 + uTime * 0.4);
            pos.x += noise * 0.5;
            pos.y += noise * 0.5;
            pos.z += noise * 0.5;

            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_Position = projectionMatrix * mvPosition;

            float distanceToCamera = -mvPosition.z;
            gl_PointSize = aSize * (30.0 / distanceToCamera);

            vAlpha = smoothstep(0.0, 1.0, sin(uTime * 1.5 + aRandom * 10.0)) * 0.5 + 0.2;
        }
      `

      const fragmentShader = `
        varying vec3 vColor;
        varying float vAlpha;
        void main() {
            float dist = length(gl_PointCoord - vec2(0.5));
            if (dist > 0.5) discard;
            float glow = exp(-dist * 3.0);
            gl_FragColor = vec4(vColor * glow, vAlpha * glow);
        }
      `

      const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: { uTime: { value: 0 } },
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        vertexColors: true,
      })

      const particlesMesh = new THREE.Points(geometry, material)
      scene.add(particlesMesh)

      let mouseX = 0
      let mouseY = 0
      const windowHalfX = window.innerWidth / 2
      const windowHalfY = window.innerHeight / 2

      const onMouseMove = (event: MouseEvent) => {
        mouseX = event.clientX - windowHalfX
        mouseY = event.clientY - windowHalfY
      }
      document.addEventListener("mousemove", onMouseMove)

      const clock = new THREE.Clock()

      const animate = () => {
        animationId = requestAnimationFrame(animate)
        const elapsedTime = clock.getElapsedTime()

        material.uniforms.uTime.value = elapsedTime
        particlesMesh.rotation.y = elapsedTime * 0.05
        particlesMesh.rotation.z = elapsedTime * 0.02

        const targetX = mouseX * 0.0005
        const targetY = mouseY * 0.0005

        camera.position.x += (targetX * 5.0 - camera.position.x) * 0.02
        camera.position.y += (-targetY * 5.0 - camera.position.y) * 0.02
        camera.lookAt(scene.position)

        composer.render()
      }
      animate()

      const onResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
        composer.setSize(window.innerWidth, window.innerHeight)
      }
      window.addEventListener("resize", onResize)

      cleanup = () => {
        cancelAnimationFrame(animationId)
        document.removeEventListener("mousemove", onMouseMove)
        window.removeEventListener("resize", onResize)
        geometry.dispose()
        material.dispose()
        renderer.dispose()
        composer.dispose()
        if (renderer.domElement.parentNode === container) {
          container.removeChild(renderer.domElement)
        }
      }
    })

    return () => cleanup()
  }, [])

  return <div ref={containerRef} className="pointer-events-none absolute inset-0 z-0 opacity-100" aria-hidden />
}
