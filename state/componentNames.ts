export type ComponentNames = { [index: string]: string }

function getComponentNames(breakComponentNames: TemplateStringsArray) {
    const componentNames: ComponentNames = {}
    const parsedBreakComponentNames: string[] = breakComponentNames.raw[0].trim().split('\n')

    parsedBreakComponentNames.forEach(componentName => {
        componentNames[componentName] = componentName
    })

    return componentNames
}

const componentNames: ComponentNames = getComponentNames`
DefaultObjects
SimpleLightSet
SimpleCube
SimpleFloor
`

export default componentNames