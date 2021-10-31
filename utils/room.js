const roomList = []//defining an array for room

/**
 * create room function for create a room when click create room
 */
function createRoom(roomName){
    var room = {roomName,messages: []}
    //pushing on roomlist this room
    roomList.push(room)

    return roomList
}


function getRooms(){
    //getting all rooms
    return roomList;
}
//exporting this rooms methods
module.exports = {
   createRoom,
   getRooms
  };