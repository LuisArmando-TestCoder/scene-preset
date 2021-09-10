import * as THREE from 'three'

export type FreeObject = {
    [index: string]: any
}

export type Group = {
    geometry?: THREE.BufferGeometry
    material?: THREE.Material
    dimensions?: number[]
    getIntersectionMesh: (indices: number[], mesh: THREE.Mesh) => THREE.Mesh
}

function callForDimensions(
    dimensions: number[],
    callback: (dimensions: number[]) => void,

    // for recursion
    dimensionIndices: number[] | null = null,
    dimensionIndex: number = 0
) {
    let newDimensionIndices = dimensionIndices && [...dimensionIndices]

    if (!dimensionIndices) {
        newDimensionIndices = new Array(dimensions.length).fill(0)
    }

    for (
        let index = 0;
        index < dimensions[dimensionIndex];
        index++
    ) {
        const indices = [...newDimensionIndices]

        indices[dimensionIndex] = index

        if (dimensionIndex === dimensions.length - 1) {
            callback(indices)
        }

        if (dimensionIndex + 1 < dimensions.length) {
            callForDimensions(
                dimensions,
                callback,
                indices,
                dimensionIndex + 1
            )
        }
    }
}

export default (groups: Group[]) => {
    const proceduralGroup = new THREE.Group()

    groups.forEach(({
        geometry,
        material,
        dimensions,
        getIntersectionMesh
    }) => {
        const mesh = new THREE.Mesh(
            geometry || new THREE.BoxBufferGeometry(1, 1, 1),
            material || new THREE.MeshStandardMaterial({color: '#e5e5e5'})
        )

        callForDimensions(
            dimensions || [1],
            dimensionsIndices => {
                const intersectionMesh = getIntersectionMesh(
                    dimensionsIndices,
                    mesh.clone()
                )

                if (intersectionMesh) {
                    proceduralGroup.add(intersectionMesh as any)
                }
            }
        )
    })

    return proceduralGroup
}
