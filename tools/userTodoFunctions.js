import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const usersPath = path.join(__dirname, '../users.json');
const todosPath = path.join(__dirname, '../todos.json');

function readJson(filePath) {
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function addUser(userId, name) {
  const users = readJson(usersPath);
  if (users.find(u => u.userId === userId)) throw new Error('User already exists');
  const user = { userId, name };
  users.push(user);
  writeJson(usersPath, users);
  return user;
}

function updateUser(userId, fieldsToUpdate) {
  const users = readJson(usersPath);
  const user = users.find(u => u.userId === userId);
  if (!user) throw new Error('User not found');
  Object.assign(user, fieldsToUpdate);
  writeJson(usersPath, users);
  return user;
}

function deleteUser(userId) {
  let users = readJson(usersPath);
  const initialLength = users.length;
  users = users.filter(u => u.userId !== userId);
  writeJson(usersPath, users);
  return { success: users.length < initialLength };
}

function addTodoForUser(userId, todo, time) {
  const todos = readJson(todosPath);
  const todoObj = { userId, todo, time, id: Date.now() };
  todos.push(todoObj);
  writeJson(todosPath, todos);
  return todoObj;
}

function deleteTodo(userId) {
  let todos = readJson(todosPath);
  const initialLength = todos.length;
  todos = todos.filter(t => t.userId !== userId);
  writeJson(todosPath, todos);
  return { success: todos.length < initialLength };
}

export default {
  addUser,
  updateUser,
  deleteUser,
  addTodoForUser,
  deleteTodo
};
