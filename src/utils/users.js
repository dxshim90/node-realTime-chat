const users = [];

const addUser = ({ id, username, room }) => {
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  if (!username || !room) {
    return {
      error: "Username and room are required"
    };
  }

  const existingUser = users.find(user => {
    return user.room === room && user.username === username;
  });
  if (existingUser) {
    return {
      error: "Username is taken"
    };
  }

  const user = { id, username, room };
  users.push(user);
  return {
    user
  };
};

const removeUser = id => {
  const index = users.findIndex(user => {
    return user.id === id;
  });

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

const getUser = id => {
  const user = users.find(user => {
    return user.id === id;
  });
  if (user) {
    return user;
  } else {
    return {
      error: "No user found"
    };
  }
};

const getUsersinRoom = room => {
  const usersinRoom = users.filter(user => {
    return user.room === room;
  });
  if (usersinRoom.length !== 0) {
    return usersinRoom;
  } else {
    return {
      error: `There are currently no users in room: ${room}`
    };
  }
};

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersinRoom
};
