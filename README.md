# scene-preset

Abstract boilerplate when making 3D scenes with Three.js

# How to

## Install ScenePreset

npm i -S scenePreset

## Start using ScenePreset

### presetScene

```jsx
import * as THREE from "three";

import presetScene from "scene-preset";

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: 0x990000 });
const mesh = new THREE.Mesh(geometry, material);

presetScene({
  setup({ scene }) {
    scene.add(mesh);
  },
  animate({ scene }) {
    mesh.rotation.y += 0.01;
  },
});
```

### On React.js with TypeScript

```tsx
import React, { useEffect } from "react";
import callScenes3D from "./callScenes3D";
import "./styles.scss";

const Canvas = ({
  scenes,
  className = "",
  id,
}: {
  scenes: string[];
  id: string;
  className?: string;
}) => {
  useEffect(() => callScenes3D(scenes, id), []);

  return (
    <div className={`canvas3d ${className}`}>
      <canvas id={id} />
    </div>
  );
};
export default Canvas;
```

### Where callScenes3D is as follows

```ts
import * as scenes3D from '../../../scenes'

export default (sceneNames: string[], id: string) => {
    for (const sceneName of sceneNames) {
        scenes3D.default[sceneName](id)
    }
}
```

### And one of the scenes could look like

```ts
import presetScene, { actions, types, consulters, events } from "scene-preset";
import * as THREE from "three";
import rainbowMaterial from "../../materials/rainbow";
import wavyMaterial from "../../materials/wavy";
import liquidMetalMaterial from "../../materials/liquidMetal";
import trippySpiralMetalMaterial from "../../materials/trippySpiral";
import textureLogicMetalMaterial from "../../materials/textureLogic";
import basicShaderToyMetalMaterial from "../../materials/basicShaderToy";
import starfieldMaterial from "../../materials/starfield";
import worleyNoiseWatersMaterial from "../../materials/worleyNoiseWaters";

actions.addSceneSetupIntrude(
  ({ presetConfiguration, camera }: { [index: string]: any }) => {
    presetConfiguration.ambient.color = 0x000000;
    presetConfiguration.camera.cameraVectorsState.top.acceleration.x *= 5;
    presetConfiguration.camera.cameraVectorsState.top.acceleration.z *= 5;
    presetConfiguration.camera.cameraVectorsState.friction.x *= 5;
    presetConfiguration.camera.cameraVectorsState.friction.z *= 5;
    camera?.setFocalLength(20);
  }
);

export default (id: string) =>
presetScene(
  {
    async setup(canvasState: { [index: string]: any }) {
      [
          rainbowMaterial,
          wavyMaterial,
          liquidMetalMaterial,
          trippySpiralMetalMaterial,
          textureLogicMetalMaterial,
          basicShaderToyMetalMaterial,
          starfieldMaterial,
          worleyNoiseWatersMaterial,
      ].forEach((material) => {
        actions.setUniforms(material);
      });

      let wasRecording = false;
      let recorder = consulters.getCanvasRecorder(
        canvasState.canvas as HTMLCanvasElement
      );

      actions.downloadCanvasRecordingOnStop(recorder);
      events.onKey("g").end(() => {
        console.log("hey");
        recorder[wasRecording ? "stop" : "start"]();
        wasRecording = !wasRecording;

        if (!wasRecording) {
          recorder = consulters.getCanvasRecorder(
            canvasState.canvas as HTMLCanvasElement
          );
          actions.downloadCanvasRecordingOnStop(recorder);
        }
      });
    },
    animate(canvasState: { [index: string]: any }) {
      actions.blacklistObjects({
        scene: canvasState.scene as THREE.Scene,
        blacklist: [
          "SimpleFloor",
          "SimpleCube",
        ],
      });
    },
  },
  `#${id}`
);
```

### Or another as

```ts
import * as THREE from "three";
import presetScene, { consulters } from "scene-preset";
import scene from "./scene";

let sceneEvents: {
  sceneGroup: THREE.Group;
  onSetup(canvasState: { [index: string]: any }): void;
  onAnimation(canvasState: { [index: string]: any }): void;
};

export default (id: string) =>
presetScene(
  {
    async setup(canvasState: { [index: string]: any }) {
      sceneEvents = await consulters.getSceneLifeCycle(scene);
    },
    animate(canvasState: { [index: string]: any }) {
      sceneEvents?.onAnimation(canvasState);
    },
  },
  `#${id}`
);
```

### And its scene as

```ts
import { Scenes } from "scene-preset/lib/types/consulters";

import lightFollower from "../../stages/lightFollower";
import nightSkyReflectors from "../../stages/nightSkyReflectors";
import characters from "../../stages/characters";

export default {
  ...characters,
  ...lightFollower,
  ...nightSkyReflectors,
} as Scenes;
```

### And one of the stages as

```ts
import * as THREE from "three";
import { Scene, Scenes, SceneExport } from "scene-preset/lib/types/consulters";
import gsap from "gsap";

import Text from "../meshes/Text";

const characters =
  ",.;:-()¿?¡!`'\"/aeiouáéíóúAEIOUÁÉÍÓÚbcdfghjklmnñpqrstvwxyzBCDFGHJKLMNÑPQRSTVWXYZ";
const charactersMeshPoolPromises: { [index: string]: THREE.Mesh } =
  Object.fromEntries(characters.split("").map(getLetterInitialEntry));

export default {
  reactiveLetters: {
    object: async () => {
      const poolPerCharacter = 10;
      const charactersPool = await getCharactersPool(poolPerCharacter);
      const charactersGroup = new THREE.Group();
      const allCharacterMeshes = Object.values(charactersPool)
        .flat()
        .map((mesh) => {
          const letterWrapper = new THREE.Group();

          letterWrapper.add(mesh);

          return letterWrapper;
        });

      allCharacterMeshes.forEach((group) => {
        const randomStepX = Math.random() * Math.PI * 2;
        const randomStepY = Math.random() * Math.PI * 2;
        const randomStepZ = Math.random() * Math.PI * 2;
        const [mesh] = group.children;

        group.rotation.set(randomStepX, randomStepY, randomStepZ);
        mesh.position.z = 10;
      });

      charactersGroup.add(...allCharacterMeshes);

      return {
        object3D: charactersGroup,
        exported: charactersPool,
      };
    },
    onSetup({ object3D, exported }: SceneExport) {
      console.log(exported, object3D);

      const timeline = gsap.timeline({/*repeat: 2, repeatDelay: 1*/});

      timeline.to(object3D.children[0].children[0].position, {x: 0, y: 2, z: 0, duration: 10});
      timeline.to(object3D.children[0].rotation, {x: 0, y: 0, z: 0, duration: 10});
    },
  } as unknown as Scene,
} as Scenes;

type MappedLetterMeshes = { [index: string]: THREE.Object3D[] };

function getInitialMappedLettersForText(
  mappedLetterMeshes: MappedLetterMeshes,
  text: string
) {
  const mappedLetters: {
    [index: string]: { meshes: THREE.Object3D[]; space: number };
  } = {};
  let space = 0;

  text.split("").forEach((letter) => {
    space++;

    if (!mappedLetterMeshes[letter]) {
      return;
    }

    if (!mappedLetters[letter]) {
      mappedLetters[letter] = {
        meshes: [mappedLetterMeshes[letter][0]],
        space,
      };

      return;
    }
  });
}

function getLetterInitialEntry(letter: string) {
  return [
    letter,
    Text({
      text: letter,
      path: "./fonts/Montserrat_Regular.json",
      size: 0.1,
      thickness: 0.025,
      color: "white",
    }),
  ];
}

async function getCharactersPool(poolPerCharacter = 10) {
  const letters = await Promise.all(Object.values(charactersMeshPoolPromises));

  return Object.fromEntries(
    letters.map((mesh, index) => {
      return [
        characters[index],
        [...new Array(poolPerCharacter)].map(() => {
          return mesh.clone();
        }),
      ];
    })
  );
}
```

### Whereas the Text in /meshes could be as follows

```ts
import * as THREE from "three";
import { FontLoader, Font } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";

const loader = new FontLoader();

interface Properties {
  text: string;
  path: string;
  size?: number;
  thickness?: number;
  color?: string;
  material?: THREE.Material;
}

export default ({
  text,
  path,
  size = 1,
  thickness = 1,
  color = "#000",
  material = new THREE.MeshStandardMaterial({ color }),
}: Properties): Promise<THREE.Mesh> => {
  return new Promise<THREE.Mesh>((resolve, reject) => {
    loader.load(
      path,
      (font: Font) => {
        const geometry = new TextGeometry(text, {
          font,
          size,
          height: thickness,
        });
        const textMesh = new THREE.Mesh(geometry, [material, material]);

        textMesh.castShadow = true;

        resolve(textMesh);
      },
      undefined,
      reject
    );
  });
};
```

## Change scene default ambient clear and fog colors

### actions.addSceneSetupIntrude

```jsx
import { actions, types } from "scene-preset";

actions.addSceneSetupIntrude((canvasState: types.state.CanvasState) => {
  canvasState.presetConfiguration.ambient.color = 0x101010;
});
```

## Blacklist 3D Objects

### actions.blacklistObjects

List objects by the name in their mesh

```jsx
import * as THREE from "three"
import presetScene, { actions } from 'scene-preset'

presetScene({
	animate({ scene }) {
		actions.blacklistObjects({
            scene: scene as THREE.Scene,
            blacklist: [
				'SimpleCube', 'SimpleFloor'
				/**
				 * The remaining ones are:
				 * - SimpleLightSet
				 * - SimpleSphere
				 */
			]
        })
    },
})
```

## Blacklist 3D Objects from a specific place set of children or parent

### actions.blacklistObjects + { objects }

List objects by the name in their mesh

```jsx
import presetScene, { actions } from "scene-preset";

presetScene({
  setup({ scene }) {
    // to be specific of from which children group to start the blacklisting
    const objects = simpleCubesGroups[0].children;
    // objects is just an array
    // ... so an specific singular parent could be called like [parent]

    actions.blacklistObjects({ scene, objects, blacklist: ["SimpleCube"] });
  },
});
```

## Whitelist 3D Objects

### actions.whitelistObjects

List objects by the name in their mesh

```jsx
import presetScene, { actions } from "scene-preset";

presetScene({
  setup({ scene }) {
    actions.whitelistObjects({ scene, whitelist: ["SimpleCube"] });
  },
});
```

## Whitelist 3D Objects from a specific place set of children or parent

### actions.whitelistObjects + { objects }

List objects by the name in their mesh

```jsx
import presetScene, { actions } from "scene-preset";

presetScene({
  setup({ scene }) {
    // to be specific of from which children group to start the whitelisting
    const objects = simpleCubesGroups[0].children;
    // objects is just an array
    // ... so an specific singular parent could be called like [parent]

    actions.whitelistObjects({
      scene,
      objects,
      whitelist: ["SimpleCube"],
    });
  },
});
```

## Blacklist controls

### actions.blacklistControls

```jsx
import presetScene, { actions, types } from "scene-preset";

presetScene({
  setup() {
    // blacklistControls needs to be used after CanvasState is initialized
    actions.blacklistControls(["setFirstPersonPosition"]);
  },
});
```

## Blacklist controls for specific scene

### actions.blacklistControls + canvasSelector

```jsx
import presetScene, { actions, types } from "scene-preset";

const canvasSelector = "#MySpecificCanvasId";

presetScene(
  {
    setup() {
      actions.blacklistControls(["setFirstPersonZoom"], canvasSelector);
    },
  },
  canvasSelector
);
```

## Know all available control's names

- setFirstPersonDirection
- setFirstPersonZoom
- setFirstPersonPosition
- setCanvasAutoFocus

## Set self updating uniforms

### actions.setUniforms

```jsx
import * as THREE from "three";
import { actions } from "scene-preset";

// Your amazing shader
import { fragmentShader } from "../Shaders/MisticalColors";

const material = new THREE.ShaderMaterial({ fragmentShader });

actions.setUniforms(material);
```

## Set self updating custom uniforms

### actions.setUniforms + customUniforms

```jsx
import { actions } from "scene-preset";

// Your amazing shader
import { vertexShader } from "../Shaders/MisticalColors";

const material = new THREE.ShaderMaterial({ vertexShader });

presetScene({
  setup({ camera }) {
    actions.setUniforms(material, {
      iCameraPosition: () => camera.position,
    });
  },
});
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
   - _iFrame // shader playback frame_
   - _iChannelTime[4] // channel playback time (in seconds)_
   - _iChannelResolution[4] // channel resolution (in pixels)_
   - _iChannel0..3 // input channel. XX = 2D/Cube_
   - _iDate_
   - _iSampleRate_

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
import { actions } from "scene-preset";

// canvas as HTMLCanvasElement
actions.screenshotCanvas(canvas);
```

## Toggle Fullscreen on element

### actions.toggleFullscreen

```jsx
import { actions } from "scene-preset";

// fullscreen can be performed in many elements, including canvas
actions.toggleFullscreen(canvas.parentElement);
```

## Change initial camera top acceleration and friction

### actions.addSceneSetupIntrude and presetConfiguration.camera.cameraVectorsState

```ts
import presetScene, { actions, types } from "scene-preset";

actions.addSceneSetupIntrude(
  ({ presetConfiguration }: types.state.CanvasState) => {
    presetConfiguration.camera.cameraVectorsState.top.acceleration.x = 0.5;
    presetConfiguration.camera.cameraVectorsState.top.acceleration.z = 0.5;
    presetConfiguration.camera.cameraVectorsState.friction.x = 0.05;
    presetConfiguration.camera.cameraVectorsState.friction.z = 0.05;
  }
);
```

## Change initial camera focal length

### actions.addSceneSetupIntrude and camera?.setFocalLength

```ts
import presetScene, { actions, types } from "scene-preset";

actions.addSceneSetupIntrude(({ camera }: types.state.CanvasState) => {
  camera?.setFocalLength(20);
});
```

## Toggle VR view

### actions.toggleVR

```jsx
import presetScene, { actions } from "scene-preset";

presetScene({
  setup({ canvasSelector }) {
    actions.toggleVR(canvasSelector);
  },
});
```

## Get, toggle canvasRecorder and download canvas recording

### consulters.getCanvasRecorder

### actions.downloadCanvasRecordingOnStop

### recorder.start | recorder.stop

```jsx
import presetScene, { actions, consulters } from "scene-preset";

presetScene({
  setup({ canvas }) {
    const someStartTime = 2e3;
    const someDuration = 5e3;
    const endTime = someStartTime + someDuration;

    // Get CanvasRecorder
    const recorder = consulters.getCanvasRecorder(canvas);

    // Start CanvasRecorder at some time
    setTimeout(() => {
      recorder.start();
    }, someStartTime);

    // Stop CanvasRecorder at some other time
    setTimeout(() => {
      recorder.stop();
    }, endTime);

    // Download canvas recording on stop
    // this will be downloaded as a .webm
    actions.downloadCanvasRecordingOnStop(recorder);
  },
});
```

## Get Audio Properties

### consulters.getAudioProperties

AudioProperties contains the following properties:

- audioContext
- analyser
- source
- initialized
- frequencies
- averageFrequency
- amplitudes
- averageAmplitude

```jsx
import presetScene, { consulters } from "scene-preset";

presetScene({
  animate() {
    // audio as HTMLMediaElement
    const audioProperties = consulters.getAudioProperties(audio);

    if (audioProperties) console.log(audioProperties);
  },
});
```

## Access camera vectors configuration

### canvasState.presetConfiguration.camera.cameraVectorsState

```jsx
import presetScene, { consulters } from "scene-preset";

presetScene(
  {
    setup({ canvasSelector }) {
      const canvasState = consulters.getCanvasState(canvasSelector);

      canvasState.presetConfiguration.camera.cameraVectorsState.position.min.y =
        -Infinity;

      canvasState.presetConfiguration.camera.cameraVectorsState.position.y = 2;
    },
  },
  "canvas"
);
```

The following types and interfaces are contained within
the CameraVectorsState type

```ts
interface Position {
  x: number;
  z: number;
  y: number;
  min: {
    y: number;
  };
}

interface FlySpeed {
  force: number;
  direction: number;
  friction: number;
  acceleration: number;
  max: {
    acceleration: number;
  };
}

interface Acceleration {
  x: number;
  z: number;
}

interface Friction {
  x: number;
  z: number;
}

interface Top {
  acceleration: Acceleration;
}

type Rotation = number;

type ChosenAxis = "x" | "y" | "z";
```

## Set procedural group

### consulters.getProceduralGroup

```jsx
import * as THREE from "three";
import presetScene, { consulters } from "scene-preset";

const cubesNet = consulters.getProceduralGroup([
  {
    geometry: new THREE.BoxBufferGeometry(0.5, 0.5, 0.5),
    getIntersectionMesh(indices, mesh) {
      // this function can be asynchronous as well
      mesh.position.set(indices[0], indices[1], indices[2]);

      return mesh;
    },
    dimensions: [3, 3, 3],
  },
]);

presetScene({
  setup({ scene }) {
    scene.add(cubesNet);
  },
});
```

The following is the representation of the type for each group

In getIntersectionMesh if the mesh is not returned then it won't be rendered

```ts
type Group = {
  geometry?: THREE.BufferGeometry;
  material?: THREE.Material;
  dimensions?: number[];
  getIntersectionMesh: (
    indices: number[],
    mesh: THREE.Mesh
  ) => THREE.Mesh | void;
};
```

## Use getSceneLifeCycle

### Types for Scene

```ts
type SceneExport = {
  object3D: THREE.Object3D;
  [index: string]: any;
};
type SceneExportForScene = {
  object3D: THREE.Object3D | Promise<THREE.Object3D>[] | THREE.Object3D[];
  [index: string]: any;
};
type ExportedScene = {
  [index: string]: SceneExport;
};
type Scene = {
  properties?: {
    position?: THREE.Vector3;
    rotation?: THREE.Vector3;
    scale?: THREE.Vector3;
  };
  object?: () =>
    | Promise<THREE.Object3D>
    | THREE.Object3D
    | Promise<THREE.Object3D>[]
    | THREE.Object3D[]
    | Promise<SceneExport>
    | SceneExport
    | SceneExportForScene;
  onAnimation?: (exportedScene: ExportedScene, canvasState: CanvasState) => {};
  onSetup?: (exportedScene: ExportedScene, canvasState: CanvasState) => {};
};
type Scenes = {
  [index: string]: Scene;
};
```

### On someScene.ts

```ts
import { events, consulters } from "scene-preset";
import { Scene, Scenes, SceneExport } from "scene-preset/lib/types/consulters";
import { CanvasState } from "scene-preset/lib/types/state";
import gsap from "gsap";

// The following exports are hypothetical
import rainbowMaterial from "../../materials/rainbow";
import linkImages from "./linkImages.store";
import Image from "../../meshes/Image";
import Text from "../../meshes/Text";
import Model from "../../meshes/Model";
import getTextureMaterial from "../../materials/getTextureMaterial";
import PointLightSet from "../../meshes/PointLightSet";

export default {
  discoBall: {
    properties: {
      position: new THREE.Vector3(0, 25, 0),
      scale: new THREE.Vector3(0.03, 0.03, 0.03),
    },
    object: async () => await Model("./models/disco_ball/scene.gltf"),
    onAnimation({ object3D }: SceneExport) {
      object3D.rotation.y += 0.01;
    },
  } as unknown as Scene,
  discoStatue: {
    properties: {
      position: new THREE.Vector3(0, 100, 25),
      scale: new THREE.Vector3(50, 50, 50),
      rotation: new THREE.Vector3(Math.PI, 0, 0),
    },
    object: async () => await Model("./models/venus_de_disco/scene.gltf"),
    onAnimation({ object3D }: SceneExport) {
      object3D.rotation.y += 0.01;
    },
  } as unknown as Scene,
  someText: {
    properties: {
      position: new THREE.Vector3(5, 3, 20),
      rotation: new THREE.Vector3(0, Math.PI, 0),
    },
    object: async () => ({
      object3D: [
        await Text({
          text: `Hello,

          it's been quite long`,
          path: "./fonts/Montserrat_Regular.json",
          color: "#f00",
          thickness: 0.1,
          size: 0.5,
        }),
      ],
      additionalInfo: "Any type can be given as an additional property",
    }),
    onSetup({ additionalInfo, object3D }: SceneExport) {
      console.log(additionalInfo, object3D);
    },
  } as unknown as Scene,
  discoPlanet: {
    properties: {
      position: new THREE.Vector3(0, 200, 0),
    },
    object: () => [
      consulters.getProceduralGroup([
        {
          geometry: new THREE.TorusBufferGeometry(1, 0.1, 3, 100),
          material: rainbowMaterial,
          dimensions: [250],
          getIntersectionMesh([index], mesh) {
            const size = 250;
            const rescale = 15;
            const step = (index / size - 0.5) * Math.PI * 2;
            const scaleY1 = Math.cos(step) * rescale;
            const scaleY2 = Math.sin(step) * rescale;

            mesh.position.y = scaleY1;
            mesh.scale.set(scaleY2, scaleY2, 0);
            mesh.rotateX(Math.PI / 2);

            return mesh;
          },
        },
        {
          geometry: new THREE.TorusBufferGeometry(10, 0.1, 10, 100),
          material: rainbowMaterial,
          dimensions: [3],
          getIntersectionMesh([index], mesh) {
            const size = 3;
            const rescale = 1.5;
            const step = (index / size - 0.5) * Math.PI * 2;
            const scaleY2 = Math.sin(step) * rescale;

            mesh.scale.set(3.5 + scaleY2, 3.5 + scaleY2, 1);
            mesh.rotateX(Math.PI / 2);

            return mesh;
          },
        },
      ]),
      PointLightSet([
        {
          color: "#f00",
          distance: 100,
          intensity: 1,
          decay: 2,
        },
      ]),
    ],
  } as unknown as Scene,
  links: {
    properties: {
      position: new THREE.Vector3(0, 0, 25),
    },
    object: async () => {
      const redirectObjects = new THREE.Group();
      const distance = Object.entries(linkImages).length * 3;
      let index = 0;

      for (const [name, urls] of Object.entries(linkImages)) {
        const [redirect, imageURL] = urls;
        const image = await Image(imageURL, 10);
        const step =
          (++index / Object.entries(linkImages).length) * Math.PI * 2;

        image.position.x = Math.sin(step) * distance;
        image.position.z = Math.cos(step) * distance;
        image.name = redirect;

        image.lookAt(new THREE.Vector3(0, 0, 0));

        redirectObjects.add(image);

        const text = await Text({
          text: name,
          path: "./fonts/Montserrat_Regular.json",
          color: "#f00",
          thickness: 0.1,
          size: 0.5,
        });

        text.position.x = Math.sin(step) * (distance * 0.99);
        text.position.z = Math.cos(step) * (distance * 0.99);
        text.name = redirect;

        text.lookAt(new THREE.Vector3(0, 0, 0));

        redirectObjects.add(text);
      }

      return [
        redirectObjects,
        PointLightSet([
          {
            color: "#00f",
            position: new THREE.Vector3(0, 15, 0),
            distance: 50,
            intensity: 1,
          },
        ]),
      ];
    },
    onSetup({ object3D }: SceneExport) {
      object3D.children[0].children.forEach((child) => {
        events.onClickIntersectsObject([child], () => {
          window.open(child.name, "_blank");
        });
      });
    },
  } as unknown as Scene,
  tunnelSquares: {
    object: () =>
      consulters.getProceduralGroup([
        {
          geometry: new THREE.BoxBufferGeometry(10, 10, 10),
          material: getTextureMaterial({
            maps: {
              baseColor: "./textures/floral-texture/albedo.png",
              normal: "./textures/floral-texture/normal-ogl.png",
              roughness: "./textures/floral-texture/roughness.png",
              ao: "./textures/floral-texture/ao.png",
              metal: "./textures/floral-texture/metallic.png",
            },
          }),
          getIntersectionMesh(indices, mesh) {
            const step = (indices[1] / 60) * Math.PI * 2;
            const size = 10;
            const y = (indices[0] - 50) * size;
            mesh.position.set(
              Math.sin(step) * (30 / Math.PI) * size,
              y,
              Math.cos(step) * (30 / Math.PI) * size
            );
            mesh.lookAt(new THREE.Vector3(0, y, 0));

            if (Math.random() < 0.75) {
              return mesh;
            }
          },
          dimensions: [100, 60],
        },
      ]),
  } as unknown as Scene,
  floatingSquares: {
    object: () =>
      consulters.getProceduralGroup([
        {
          geometry: new THREE.BoxBufferGeometry(0.25, 0.25, 0.25) as any,
          material: new THREE.MeshBasicMaterial({
            color: "#f00",
          }),
          getIntersectionMesh(indices, mesh) {
            const size = 5;
            mesh.position.set(
              Math.sin((indices[0] / size) * Math.PI * 2) * Math.random() * 50,
              indices[1] * 10,
              Math.cos((indices[2] / size + Math.random()) * Math.PI * 2) *
                Math.random() *
                50
            );

            return mesh;
          },
          dimensions: [5, 5, 5],
        },
      ]),
    onSetup({ object3D }: SceneExport) {
      object3D.children.forEach((element: THREE.Object3D) => {
        gsap.timeline().to(element.position, {
          y: element.position.y + Math.random() * 20,
          duration: 20,
        });
        events.onClickIntersectsObject([element], () => {
          gsap.timeline().to(element.rotation, {
            x: Math.random() * 10,
            y: Math.random() * 10,
            z: Math.random() * 10,
            duration: 3,
          });
        });
      });
    },
  } as unknown as Scene,
  floor: {
    properties: {
      position: new THREE.Vector3(0, -6, 0),
    },
    object: () =>
      new THREE.Mesh(
        new THREE.PlaneBufferGeometry(2000, 2000),
        getTextureMaterial({
          multiplyScalar: 300,
          maps: {
            baseColor: "./textures/mahogfloor/basecolor.png",
            normal: "./textures/mahogfloor/normal.png",
            roughness: "./textures/mahogfloor/roughness.png",
            ao: "./textures/mahogfloor/AO.png",
            bump: "./textures/mahogfloor/Height.png",
          },
        })
      ),
    onSetup({ object3D: floor }: SceneExport) {
      floor.rotateX(Math.PI / 2);
    },
  } as unknown as Scene,
  lightFollower: {
    object: () =>
      PointLightSet([
        {
          color: "#f00",
          position: new THREE.Vector3(0, 2, 0),
          distance: 35,
          intensity: 1,
        },
      ]),
    onAnimation: ({ object3D }: SceneExport, canvasState: CanvasState) => {
      object3D.position.set(
        canvasState.camera?.position.x as number,
        canvasState.camera?.position.y as number,
        canvasState.camera?.position.z as number
      );
    },
  } as unknown as Scene,
} as Scenes;
```

### On someSceneTrigger.ts

```ts
import presetScene, { actions, consulters } from "scene-preset";
import * as THREE from "three";
import someScene from "./someScene";

const sceneEvents = consulters.getSceneLifeCycle(someScene);

export default (id: string) =>
  presetScene(
    {
      async setup(canvasState) {
        (await sceneEvents).onSetup(canvasState);
      },
      async animate(canvasState) {
        (await sceneEvents).onAnimation(canvasState);
      },
    },
    `#${id}`
  );
```
