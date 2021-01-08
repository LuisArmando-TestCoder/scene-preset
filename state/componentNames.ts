export type ComponentNames = { [index: string]: string }

function getComponentNames(breaklinedComponentNames: TemplateStringsArray) {
    const componentNames: ComponentNames = {}
    const parsedBreaklinedComponentNames: string[] = breaklinedComponentNames.raw[0].trim().split('\n')

    parsedBreaklinedComponentNames.forEach(componentName => {
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