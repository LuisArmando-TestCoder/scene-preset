# scene-preset
Abstract boilerplate when making 3D scenes with Three.js

# How to

## Install ScenePreset

npm i -S scenePreset

## Start using ScenePreset

### presetScene

```jsx
import * as THREE from 'three'

import presetScene from 'scene-preset'

const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshStandardMaterial({ color: 0x990000 })
const mesh = new THREE.Mesh(geometry, material)

presetScene({ 
	setup({ scene }) {
		scene.add(mesh)
	},
	animate({ scene }) {
		mesh.rotation.y += .01
	},
})
```

## Change scene default ambient clear and fog colors

### actions.addSceneSetupIntrude

```jsx
import { actions, types } from 'scene-preset'

actions.addSceneSetupIntrude((canvasState: types.state.CanvasState) => {
	canvasState.presetConfiguration.ambient.color = 0x101010
})
```

## Blacklist 3D Objects

### actions.blacklistObjects

List objects by the name in their mesh

```jsx
import presetScene, { actions } from 'scene-preset'

presetScene({ 
	setup({ scene }) {
		actions.blacklistObjects({ scene, blacklist: ['SimpleCube'] })
    },
})
```

## Blacklist 3D Objects from a specific place set of children or parent

### actions.blacklistObjects + { objects }

List objects by the name in their mesh

```jsx
import presetScene, { actions } from 'scene-preset'

presetScene({ 
	setup({ scene }) {
		// to be specific of from which children group to start the blacklisting
		const objects = simpleCubesGroups[0].children
		// objects is just an array
		// ... so an specific singular parent could be called like [parent]

		actions.blacklistObjects({ scene, objects, blacklist: ['SimpleCube'] })
    },
})
```

## Whitelist 3D Objects

### actions.whitelistObjects

List objects by the name in their mesh

```jsx
import presetScene, { actions } from 'scene-preset'

presetScene({ 
	setup({ scene }) {
		actions.whitelistObjects({ scene, whitelist: ['SimpleCube'] })
    },
})
```

## Whitelist 3D Objects from a specific place set of children or parent

### actions.whitelistObjects + { objects }

List objects by the name in their mesh

```jsx
import presetScene, { actions } from 'scene-preset'

presetScene({ 
    setup({ scene }) {
		// to be specific of from which children group to start the whitelisting
		const objects = simpleCubesGroups[0].children
		// objects is just an array
		// ... so an specific singular parent could be called like [parent]

		actions.whitelistObjects({
			scene,
			objects,
			whitelist: ['SimpleCube']
		})
    },
})
```

## Blacklist controls

### actions.blacklistControls

```jsx
import presetScene, { actions, types } from 'scene-preset'

presetScene({ 
	setup() {
		// blacklistControls needs to be used after CanvasState is initialized
		actions.blacklistControls(['setFirstPersonPosition'])
    },
})
```

## Blacklist controls for specific scene

### actions.blacklistControls + canvasSelector

```jsx
import presetScene, { actions, types } from 'scene-preset'

const canvasSelector = '#MySpecificCanvasId'

presetScene({ 
	setup() {
		actions.blacklistControls(['setFirstPersonZoom'], canvasSelector)
    },
}, canvasSelector)
```

## Know all available control's names

- setFirstPersonDirection
- setFirstPersonZoom
- setFirstPersonPosition
- setCanvasAutoFocus

## Set self updating uniforms

### actions.setUniforms

```jsx
import * as THREE from 'three'
import { actions } from 'scene-preset'

// Your amazing shader
import { fragmentShader } from '../Shaders/MisticalColors'

const material = new THREE.ShaderMaterial({ fragmentShader })

actions.setUniforms(material)
```

## Set self updating custom uniforms

### actions.setUniforms + customUniforms

```jsx
import { actions } from 'scene-preset'

// Your amazing shader
import { vertexShader } from '../Shaders/MisticalColors'

const material = new THREE.ShaderMaterial({ vertexShader })

presetScene({ 
	setup({ camera }) {
		actions.setUniforms(material, {
				iCameraPosition: () => camera.position
    	})
	}
})
```

## Know how to write my shader

1. Write shaders like you are used to with Three.js
2. You would have some default uniforms updating, their names are standardized with ShaderToy
3. Uniforms like the ones in the following list are available for you to reference them in your shader:
    - iResolution → viewport resolution (in pixels)
    - iTime → shader playback time (in seconds)
    - iTimeDelta → render time (in seconds)
    - iMouse → mouse pixel coords. xy: current (if MLB down), zw: click
4. Is intended to add these over time:
    - *iFrame // shader playback frame*
    - *iChannelTime[4] // channel playback time (in seconds)*
    - *iChannelResolution[4] // channel resolution (in pixels)*
    - *iChannel0..3 // input channel. XX = 2D/Cube*
    - *iDate*
    - *iSampleRate*

```jsx
uniform vec3      iResolution;
uniform float     iTime;
uniform float     iTimeDelta;
// uniform int       iFrame;
// uniform float     iChannelTime[4];
// uniform vec3      iChannelResolution[4];
uniform vec4      iMouse;
// uniform samplerXX iChannel0..3;
// uniform vec4      iDate;
// uniform float     iSampleRate;

void main() {
    gl_FragColor = vec4(0., 1., 1., 1.);
}
```

## Screenshot canvas

### actions.screenshotCanvas

```jsx
import { actions } from 'scene-preset'

// canvas as HTMLCanvasElement
actions.screenshotCanvas(canvas)
```

## Toggle Fullscreen on element

### actions.toggleFullscreen

```jsx
import { actions } from 'scene-preset'

// fullscreen can be performed in many elements, including canvas
actions.toggleFullscreen(canvas.parentElement)
```

## Toggle VR view

### actions.toggleVR

```jsx
import presetScene, { actions } from 'scene-preset'

presetScene({
	setup({ canvasSelector }) {
		actions.toggleVR(canvasSelector)
	}
})
```

## Get, toggle canvasRecorder and download canvas recording

### consulters.getCanvasRecorder

### actions.downloadCanvasRecordingOnStop

### recorder.start | recorder.stop

```jsx
import presetScene, { actions, consulters } from 'scene-preset'

presetScene({
	setup({ canvas }) {
		const someStartTime = 2e3
		const someDuration = 5e3
		const endTime = someStartTime + someDuration

		// Get CanvasRecorder
		const recorder = consulters.getCanvasRecorder(canvas)

		// Start CanvasRecorder at some time
		setTimeout(() => {
			recorder.start()
		}, someStartTime)

		// Stop CanvasRecorder at some other time
		setTimeout(() => {
			recorder.stop()
		}, endTime)

		// Download canvas recording on stop
		// this will be downloaded as a .webm
        actions.downloadCanvasRecordingOnStop(recorder)
	}
})
```

## Get Audio Properties

### consulters.getAudioProperties

AudioProperties contains the following properties:

- audioContext
- analyser
- source
- initialized
- frequencies
- averageFrequecy
- amplitudes
- averageAmplitude

```jsx
import presetScene, { consulters } from 'scene-preset'

presetScene({
    animate() {
		// audio as HTMLMediaElement
		const audioProperties = consulters.getAudioProperties(audio)

		if (audioProperties) console.log(audioProperties)
	}
})
```

## Access camera vectors configuration

### canvasState.presetConfiguration.camera.cameraVectorsState

```jsx
import presetScene, { consulters } from 'scene-preset'

presetScene({
	setup({ canvasSelector }) {
		const canvasState = consulters.getCanvasState(canvasSelector)
		
		canvasState.presetConfiguration.camera
			.cameraVectorsState.position.min.y = -Infinity

		canvasState.presetConfiguration.camera
			.cameraVectorsState.position.y = 2
	},
}, 'canvas')
```

The following types and interfaces are contained within
the CameraVectorsState type

```ts
interface Position {
	x: number
	z: number
	y: number
	min: {
		y: number
	}
}

interface FlySpeed {
	force: number
	direction: number
	friction: number
	acceleration: number
	max: {
		acceleration: number
	}
}

interface Acceleration {
	x: number
	z: number
}

interface Friction {
	x: number
	z: number
}

interface Top {
	acceleration: Acceleration
}

type Rotation = number

type ChosenAxis = 'x' | 'y' | 'z'
```

## Set procedural group

### consulters.getProceduralGroup

```jsx
import * as THREE from 'three'
import presetScene, { consulters } from 'scene-preset'

const cubesNet = consulters.getProceduralGroup([
	{
		geometry: new THREE.BoxBufferGeometry(.5, .5, .5),
		getIntersectionMesh(indices, mesh) {
			mesh.position.set(
				indices[0],
				indices[1],
				indices[2]
			)

			return mesh
		},
		dimensions: [3, 3, 3]
	}
])

presetScene({
    setup({ scene }) {
        scene.add(cubesNet)
    },
})
```