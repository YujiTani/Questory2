const users = [
  { id: 1, name: "tarou", age: 15 },
  { id: 2, name: "hanako", age: 20 },
];

export const createUser = async (name: string, age: number) => {
  // repository
  const user = { id: users.length + 1, name, age };
  users.push(user);
  return user;
};
