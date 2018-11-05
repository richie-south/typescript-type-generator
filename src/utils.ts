import {
  InterfaceDeclaration,
} from 'ts-simple-ast'

export function capitalize (str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * cheks if interface has been created before
 */
export function hasBeenCreatedBefore(
  interfaceDeclarations: Array<InterfaceDeclaration> = [],
  interfaceDeclaration: InterfaceDeclaration
): undefined | string {
  const newStructure = interfaceDeclaration.getStructure()

  let structureToRetrun
  interfaceDeclarations.forEach(declaration => {
    const oldStructure = declaration.getStructure()
    if (
      JSON.stringify(oldStructure.properties) ===
      JSON.stringify(newStructure.properties)
    ) {
      structureToRetrun = oldStructure.name
    }
  })

  return structureToRetrun
}

/**
 *  add or removes created interface to return array
 */
export function addOrRemoveInterface(
  createdInterface: InterfaceDeclaration,
  interfaces: Array<InterfaceDeclaration> = []
) {
  const oldInterfaceName = hasBeenCreatedBefore(interfaces, createdInterface)

  if (oldInterfaceName) {
    createdInterface.remove()
    return {
      name: oldInterfaceName,
      interfaces,
    }
  }

  return {
    name: createdInterface.getStructure().name,
    interfaces: [...interfaces, createdInterface],
  }
}

export function buildTypeStringOfArrayTypes (array: Array<string>) {
  const types = array.join(' | ')
  return `Array<${types}>`
}
