import './App.css'
import AddItem from './components/AddItem'
import { useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useEffect } from 'react'
import { getDb } from './data/database'

function App() {
    const [todos, setTodos] = useState([])
    const [editTodo, setEditTodo] = useState()
    let dbTodos = useRef(null)

    useEffect(() => {
        async function fetchData() {
            dbTodos.current = (await getDb()).todos
            dbTodos.current
                .find({ selector: {}, sort: [{ createdAt: 'asc' }] })
                .$.subscribe((todosInDb) => {
                    if (!todosInDb) {
                        return
                    }
                    setTodos(todosInDb)
                })
        }
        fetchData()
    }, [])

    const addOrUpdateItemOnClick = async (item) => {
        let newTodo
        if (item.id) {
            try {
                newTodo = await dbTodos.current.findOne(item.id).exec()
                newTodo.update({
                    $set: {
                        title: item.title,
                        editing: false,
                        updatedAt: new Date().toISOString(),
                    },
                })
            } catch (error) {
                console.log('error ', error)
            }
        } else if (item.title) {
            newTodo = {
                title: item.title,
                state: false,
                id: uuidv4(),
                editing: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            }
            const tempDoc = dbTodos.current.newDocument(newTodo)

            tempDoc.save()
        }
    }

    const toggleItem = (todo) => {
        todo.update({
            $set: {
                state: !todo.state,
                updatedAt: new Date().toISOString(),
            },
        })
    }

    const removeItem = (id) => {
        dbTodos.current
            .find({
                selector: {
                    id: {
                        $eq: id,
                    },
                },
            })
            .remove()
    }

    const editItem = async (item) => {
        const newEditTodo = await dbTodos.current.findOne(item.id).exec()
        await newEditTodo.update({
            $set: {
                editing: true,
            },
        })
        setEditTodo(newEditTodo.toMutableJSON())
    }

    return (
        <>
            <ul>
                {todos.map(function (item) {
                    return (
                        <li key={item.id}>
                            <span className={item.state ? 'completed' : ''}>
                                <input
                                    type="checkbox"
                                    id={item.id}
                                    checked={item.state}
                                    onChange={() => toggleItem(item)}
                                />
                                <label htmlFor={item.id}> {item.title}</label>
                            </span>
                            <label>
                                <input
                                    type="button"
                                    className="delete"
                                    onClick={() => removeItem(item.id)}
                                />
                                <span className="label icon"></span>
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    className="edit"
                                    checked={item.editing}
                                    onChange={() => editItem(item)}
                                />
                                <span className="label icon"></span>
                            </label>
                        </li>
                    )
                })}
            </ul>
            <br />
            <AddItem onClick={addOrUpdateItemOnClick} editTodo={editTodo} />
        </>
    )
}

export default App
