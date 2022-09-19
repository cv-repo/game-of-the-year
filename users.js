 const users = []

 const addUser = ({id, name, room}) => {
    const numUsersRoom = users.filter(user => user.room === room).length
    if(numUsersRoom === 4) return { error: 'Room full' }

    const newUser = { id, name, room }
    users.push(newUser)
    return { newUser }
}

const removeUser = (id) => {
    let index = users.findIndex(user => user.id === id)
    if(index !==-1) return users.splice(index, 1)[0]
}

const getUser = (id) => {
    return users.find(user => user.id === id)
}

const getUsersInRoom = (room) => {
    return users.filter(user => user.room === room)
}

const userLeft = (room) => {
    let users = getUsersInRoom(room)
    if(users.findIndex(user => user.name === 1) == -1) return 1
    else if(users.findIndex(user => user.name === 2) == -1) return 2
    else if(users.findIndex(user => user.name === 3) == -1) return 3
    else if(users.findIndex(user => user.name === 4) == -1) return 4
}

module.exports = { addUser, removeUser, getUser, getUsersInRoom, userLeft }
