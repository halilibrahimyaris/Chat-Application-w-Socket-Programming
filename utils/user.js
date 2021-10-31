const users = [];
//define an array for keeping users
// Join user to chat
//
function userJoin(id, username, room) {
  //creating user with id username and room name
  const user = { id, username, room };
  //pushing created user to users array
  users.push(user);

  return user;
}

// Get current user
function getCurrentUser(id) {
  //getting current user via user.id 
  return users.find(user => user.id === id);
}

// User leaves chat
function userLeave(id) {
  //finding leaved user from user.id
  const index = users.findIndex(user => user.id === id);

  if (index !== -1) {
    //if a user leave pop from users
    return users.splice(index, 1)[0];
  }
}

// Get room users
function getRoomUsers(room) {
  //get current users 
  return users.filter(user => user.room === room);
}
//get this user
function getUser(id) {
  //getting current user via user.id 
  return users.find(user => user.id === id);
}
/**
 * exporting this class method for using server class
 */
module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
  getUser,
};