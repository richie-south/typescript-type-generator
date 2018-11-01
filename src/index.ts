import {
  IndentationText,
  Project,
  SourceFile,
  InterfaceDeclaration,
} from 'ts-simple-ast'
import {capitalize} from './utils'

/**
 * cheks if interface has been created before
 */
function hasBeenCreatedBefore(
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
 * checks all types of array, combines them to string
 */
function collectTypesFromArray(
  array: Array<any>,
  arrayName: string,
  file: SourceFile,
  createdInterfaces: Array<InterfaceDeclaration> = []
) {
  return (
    array
      .map(value => {
        if (Array.isArray(value)) {
          return collectTypesFromArray(
            value,
            `${arrayName}A`,
            file,
            createdInterfaces
          )
        } else if (value === null) {
          return 'null'
        } else if (typeof value === 'object') {
          const capitalizedKey =
            createdInterfaces.length === 0
              ? capitalize(arrayName)
              : capitalize(`${arrayName}${createdInterfaces.length}`)

          const createdInterface = createInterface(value, capitalizedKey, file)
          const oldInterfaceName = hasBeenCreatedBefore(
            createdInterfaces,
            createdInterface
          )

          if (oldInterfaceName !== undefined) {
            createdInterface.remove()
            return oldInterfaceName
          }

          createdInterfaces.push(createdInterface)
          return capitalizedKey
        }

        return typeof value
      })
      // remove nested arrays
      .reduce((a, b) => a.concat(b), [])
      // only return uniq
      .reduce((uniqTypes, type) => {
        if (!uniqTypes.includes(type)) {
          return [...uniqTypes, type]
        }
        return uniqTypes
      }, [])
      // build type string
      .reduce((types, type, index) => {
        if (index === 0) {
          return `${type}`
        }

        return `${types} | ${type}`
      }, '')
  )
}

/**
 * creates one interface for object, supports nested objects and arrays
 */
function createInterface(
  object: {[key: string]: any},
  objectName: string,
  file: SourceFile
) {
  const interfaceDeclaration = file.addInterface({
    name: objectName,
  })

  Object.keys(object).forEach(key => {
    const name = key
    let typeName: string = typeof object[key]

    if (Array.isArray(object[key])) {
      const types = collectTypesFromArray(object[key], key, file)
      typeName = `Array<${types === '' ? 'any' : types}>`
    } else if (object[key] === null) {
      typeName = 'null'
    } else if (typeof object[key] === 'object') {
      typeName = capitalize(key)
      createInterface(object[key], typeName, file)
    }

    interfaceDeclaration.addProperty({
      name,
      type: typeName,
    })
  })

  return interfaceDeclaration
}

export function createInterfacesFromObject(
  objectName: string,
  object: {[key: string]: any}
) {
  const fileName = 'file.ts'
  const project = new Project({
    useVirtualFileSystem: true,
    manipulationSettings: {indentationText: IndentationText.TwoSpaces},
  })
  const fs = project.getFileSystem()
  const file = project.createSourceFile(fileName, '')

  createInterface(object, objectName, file)

  file.saveSync()
  return fs.readFileSync(fileName)
}
