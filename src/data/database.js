import { createRxDatabase, addRxPlugin } from 'rxdb'
import { getRxStorageDexie } from 'rxdb/plugins/dexie'
import { todoSchema, todosMockData } from './data'
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode'
import { RxDBUpdatePlugin } from 'rxdb/plugins/update'
addRxPlugin(RxDBDevModePlugin)
addRxPlugin(RxDBUpdatePlugin)

let dbPromise = null

const _create = async () => {
    let db
    try {
        db = await createRxDatabase({
            name: 'todosdb',
            storage: getRxStorageDexie(),
        })
    } catch (error) {
        console.error(error)
    }

    // create collections
    const todosCollections = await db.addCollections({
        todos: {
            schema: todoSchema,
        },
    })

    const result = await todosCollections.todos.bulkInsert(todosMockData)

    if (result.error) {
        console.log('DatabaseService: bulkInsert error: ', result.error)
    }
    return db
}

export const getDb = () => {
    if (!dbPromise) dbPromise = _create()
    return dbPromise
}
