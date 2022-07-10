export const todosMockData = [
    {
        id: '01',
        title: 'todo01',
        state: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        editing: false,
    },
    {
        id: '02',
        title: 'todo02',
        state: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        editing: false,
    },
    {
        id: '03',
        title: 'todo03',
        state: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        editing: false,
    },
    {
        id: '04',
        title: 'todo04',
        state: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        editing: false,
    },
]

export const todoSchema = {
    title: 'todo schema',
    version: 0,
    primaryKey: 'id',
    type: 'object',
    properties: {
        id: {
            type: 'string',
            maxLength: 100, // <- the primary key must have set maxLength
        },
        title: {
            type: 'string',
        },
        state: {
            type: 'boolean',
        },
        editing: {
            type: 'boolean',
        },
        createdAt: {
            type: 'string',
            maxLength: 100,
            format: 'date-time',
        },
        updatedAt: {
            type: 'string',
            maxLength: 100,
            format: 'date-time',
        },
    },
    required: ['id', 'title', 'state'],
    indexes: ['updatedAt'],
}
