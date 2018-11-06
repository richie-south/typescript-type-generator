import {
  IndentationText,
  Project,
  SourceFile,
  InterfaceDeclaration,
} from 'ts-simple-ast'
import {
  capitalize,
  addOrRemoveInterface,
  buildTypeStringOfArrayTypes,
} from './utils'

/**
 * checks all types of array, combines them to string
 */
function collectTypesFromArray(
  array: Array<any>,
  arrayName: string,
  file: SourceFile,
  createdInterfaces: Array<InterfaceDeclaration> = []
) {
  if (array.length === 0) {
    return {
      types: ['any'],
      interfaces: createdInterfaces,
    }
  }

  const types = array
    .map(value => {
      if (Array.isArray(value)) {
        const {types, interfaces} = collectTypesFromArray(
          value,
          `${arrayName}A`,
          file,
          createdInterfaces
        )
        createdInterfaces = interfaces
        return types
      } else if (value === null) {
        return 'null'
      } else if (typeof value === 'object') {
        const capitalizedKey =
          createdInterfaces.length === 0
            ? capitalize(arrayName)
            : capitalize(`${arrayName}${createdInterfaces.length}`)

        const {
          interface: createdInterface,
          interfaces: newInterfaces,
        } = createInterface(value, capitalizedKey, file, '', createdInterfaces)
        const {interfaces, name} = addOrRemoveInterface(
          createdInterface,
          newInterfaces
        )

        createdInterfaces = interfaces
        return name
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

  return {
    types,
    interfaces: createdInterfaces,
  }
}

/**
 * creates one interface for object, supports nested objects and arrays
 */
function createInterface(
  object: {[key: string]: any},
  objectName: string,
  file: SourceFile,
  parrentName: string = '',
  createdInterfaces: Array<InterfaceDeclaration> = []
) {
  const interfaceDeclaration = file.addInterface({
    name: objectName,
  })

  Object.keys(object).forEach(key => {
    const name = key
    let typeName: string = typeof object[key]

    if (Array.isArray(object[key])) {
      const {types, interfaces} = collectTypesFromArray(
        object[key],
        key,
        file,
        createdInterfaces
      )
      typeName = buildTypeStringOfArrayTypes(types)
      createdInterfaces = interfaces
    } else if (object[key] === null) {
      typeName = 'null'
    } else if (typeof object[key] === 'object') {
      const capitalizeKey = capitalize(key)
      typeName = `${parrentName ? parrentName : ''}${capitalizeKey}`

      const {
        interface: createdInterface,
        interfaces: newInterfaces,
      } = createInterface(
        object[key],
        typeName,
        file,
        capitalizeKey,
        createdInterfaces
      )
      const {interfaces, name} = addOrRemoveInterface(
        createdInterface,
        newInterfaces
      )

      typeName = name
      createdInterfaces = interfaces
    }

    interfaceDeclaration.addProperty({
      name,
      type: typeName,
    })
  })

  return {
    interface: interfaceDeclaration,
    interfaces: createdInterfaces,
  }
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
  const content = fs.readFileSync(fileName)
  fs.delete(fileName)
  return content
}
