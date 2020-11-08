const users = [];

// Join user to chat
const userJoin = (id, name, room) => {
  const user = { id, name, room };
  users.push(user);
  return user;
};

// Get current user
const currentUser = (id) => {
  return users.find((user) => user.id === id);
};

module.exports = {
    userJoin,
    currentUser
}