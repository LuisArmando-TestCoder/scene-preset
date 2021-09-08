import * as THREE from 'three'

export type Properties = {
    [index: string]: (
        (indices: number[]) => string | number
    ) | Properties
}

export type FreeObject = {
    [index: string]: any
}

export type Group = {
    geometry?: THREE.BufferGeometry
    material?: THREE.Material
    dimensions?: number[]
    getPropertiesFactory: (indices: number[]) => Properties
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

function addPropertiesFactoryWithValue({
    object,
    value,
    properties
}: {
    object: FreeObject,
    value: any,
    properties: Properties
}): FreeObject {
    Object.entries(properties).forEach(
        ([property, currentValue]) => {
            if (
                !(
                    typeof object[property] === 'object' &&
                    typeof currentValue === 'object'
                )
            ) {
                object[property] = typeof currentValue === 'function' ? currentValue(
                    value
                ) : currentValue
            }

            if (typeof currentValue === 'object') { 
                addPropertiesFactoryWithValue({
                    object: object[property],
                    value,
                    properties: currentValue
                })
            }
        }
    )

    return object
}

export default (groups: Group[]) => {
    const proceduralGroup = new THREE.Group()

    groups.forEach(({
        geometry,
        material,
        dimensions,
        getPropertiesFactory
    }) => {
        const mesh = new THREE.Mesh(
            geometry || new THREE.BoxBufferGeometry(1, 1, 1),
            material || new THREE.MeshStandardMaterial({color: '#e5e5e5'})
        )

        callForDimensions(
            dimensions || [1],
            dimensionsIndices => {
                const retrievedProperties = getPropertiesFactory(dimensionsIndices)

                if (retrievedProperties) {
                    const newMesh = addPropertiesFactoryWithValue({
                        object: mesh.clone(),
                        value: dimensionsIndices,
                        properties: retrievedProperties
                    })

                    proceduralGroup.add(newMesh as any)
                }
            }
        )
    })

    return proceduralGroup
}
