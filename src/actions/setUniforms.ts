import * as THREE from "three"

import { materials, animations, customUniforms } from "../state/index"
import { CustomUniform } from "../types/state"

// uniform vec3      iResolution;           // viewport resolution (in pixels)
// uniform float     iTime;                 // shader playback time (in seconds)
// uniform float     iTimeDelta;            // render time (in seconds)
// uniform int       iFrame;                // shader playback frame
// uniform float     iChannelTime[4];       // channel playback time (in seconds)
// uniform vec3      iChannelResolution[4]; // channel resolution (in pixels)
// uniform vec4      iMouse;                // mouse pixel coords. xy: current (if MLB down), zw: click
// uniform samplerXX iChannel0..3;          // input channel. XX = 2D/Cube
// uniform vec4      iDate;                 // (year, month, day, time in seconds)
// uniform float     iSampleRate;           // sound sample rate (i.e., 44100)

const iMouse = new THREE.Vector4()

let iTime = 0

function getBaseUniforms(material: THREE.ShaderMaterial): CustomUniform {
  return {
    iResolution: () => new THREE.Vector2(window.innerWidth, window.innerHeight),
    iTime: () => parseFloat(iTime.toFixed(3)),
    iTimeDelta: () => new Date().getSeconds() / 60,
    iMouse: () => iMouse,
    // iFrame: () => null,
    // iChannelTime: () => null,
    // iChannelResolution: () => null,
    // iChannel0: () => null,
    // iChannel1: () => null,
    // iChannel2: () => null,
    // iChannel3: () => null,
    // iDate: () => null,
    // iSampleRate: () => null,
  }
}

function setUniformsWatcher() {
  const shaderMaterials = materials as THREE.ShaderMaterial[]

  iTime += 0.01

  shaderMaterials.forEach(assignUniforms)
}

function assignUniforms(material: THREE.ShaderMaterial, materialIndex: number) {
  const baseUniforms = getBaseUniforms(material)

  for (const uniformName in baseUniforms) {
    assignUniformValue(material, uniformName, baseUniforms[uniformName]())
  }

  for (const uniformName in customUniforms[materialIndex]) {
    assignUniformValue(
      material,
      uniformName,
      customUniforms[materialIndex][uniformName]()
    )
  }
}

function assignUniformValue(
  material: THREE.ShaderMaterial,
  uniformName: string,
  value: any
) {
  if (!material.uniforms[uniformName]) {
    material.uniforms[uniformName] = { value }

    return
  }

  material.uniforms[uniformName].value = value
}

function overrideCustomUniforms(
  customUniform: CustomUniform,
  materialIndex: number
) {
  const uniform = customUniforms[materialIndex]

  for (const uniformName in customUniform) {
    uniform[uniformName] = customUniform[uniformName]
  }
}

function setIMouseWatchers() {
  window.addEventListener("mousemove", (event: MouseEvent) => {
    iMouse.set(event.clientX, event.clientY, iMouse.z, iMouse.w)
  })

  window.addEventListener("click", (event: MouseEvent) => {
    iMouse.set(iMouse.x, iMouse.y, event.clientX, event.clientY)
  })
}

export default function setUniforms(
  material: THREE.ShaderMaterial,
  customUniform: CustomUniform = {}
) {
  if (!animations.includes(setUniformsWatcher)) {
    animations.push(setUniformsWatcher)
    setIMouseWatchers()
  }

  if (!materials.includes(material)) {
    materials.push(material)
    customUniforms.push(customUniform)
  }

  const materialIndex = materials.indexOf(material)

  overrideCustomUniforms(customUniform, materialIndex)

  // first assignment of the uniforms without animations
  assignUniforms(material, materialIndex)
}
