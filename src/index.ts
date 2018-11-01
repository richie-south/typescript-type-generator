import {IndentationText, Project} from 'ts-simple-ast'
import {capitalize} from './utils'

function hasBeenCreatedBefore (interfaceDeclarations, interfaceDeclaration) {
  const newStructure = interfaceDeclaration.getStructure()

  let structureToRetrun
  interfaceDeclarations.forEach((declaration) => {
    const oldStructure = declaration.getStructure()
    if (JSON.stringify(oldStructure.properties) === JSON.stringify(newStructure.properties)) {
      structureToRetrun = oldStructure.name
    }
  })

  return structureToRetrun
}

function collectTypes (array, arrayName, file) {
  const createdInterfaces = []
  return array.map((value) => {
    if (Array.isArray(value)) {
      throw new Error('')

    } else if (value === null) {
      return 'null'

    } else if (typeof value === 'object') {
      const capitalizedKey = createdInterfaces.length === 0
        ? capitalize(arrayName)
        : capitalize(`${arrayName}${createdInterfaces.length}`)

      const createdInterface = createInterface(value, capitalizedKey, file)
      const oldInterfaceName = hasBeenCreatedBefore(createdInterfaces, createdInterface)

      if (oldInterfaceName !== undefined) {
        createdInterface.remove()
        return oldInterfaceName
      }

      createdInterfaces.push(createdInterface)
      return capitalizedKey

    }

    return typeof value
  })
    .reduce((uniqTypes, type) => {
      if (!uniqTypes.includes(type)) {
        return [...uniqTypes, type]
      }
      return uniqTypes
    }, [])
    .reduce((types, type, index) => {
      if (index === 0) {
        return `${type}`
      }

      return `${types} | ${type}`
    }, '')
}

function createInterface (object, objectName, file) {

  const interfaceDeclaration = file.addInterface({
    name: objectName,
  })

  Object.keys(object).forEach((key) => {
    const name = key
    let typeName: string = typeof object[key]

    if (Array.isArray(object[key])) {
      const types = collectTypes(object[key], key, file)
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

export function createNewTypesFromObject (objectName, object) {
  const fileName = 'file.ts'
  const project = new Project({
    useVirtualFileSystem: true,
    manipulationSettings: { indentationText: IndentationText.TwoSpaces },
  })
  const fs = project.getFileSystem()
  const file = project.createSourceFile(fileName, '')

  createInterface(object, objectName, file)

  file.saveSync()
  return fs.readFileSync(fileName)
}
