const users = [];

const addUser = ({ id, name, room}) =>{

    // Remove all white spaces & convert the name and id to lowercase 
    name = name.trim().toLowerCase();
    room = room.trim().toLowerCase();

    // compare the name & room with existing users
    const existingUser = users.find( (user) => user.name === name && user.room === room);
    
    // If user is already exists then show an error message
    if(existingUser){
        return {error: 'username is already taken'};
    }

    // If user is not existing, then add the user to the users array
    const user = {id, name, room};
    users.push(user);

    // return the current user
    return {user};
}  

const removeUser = (id) =>{
    // find the user with 'id' from the users array
    const index = users.findIndex( (user) => user.id === id);

    // if user is found, then remove that index from users array
    if (index != -1){ // index != 0 will not work as array starts from 0 index
        return users.slice(index , 1)[0];
    }
}

const getUser = () =>{
    
}

const getUsersInRoom = () =>{
    
}