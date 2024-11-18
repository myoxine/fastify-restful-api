import { FastifyReply, FastifyRequest } from 'fastify';

import {
  addUser,
  deleteUser,
  getUserById,
  updateUser,
} from '../services/userService';

// Handle GET /users/:id
export async function getUserHandler(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  const userId = request.params.id;
  const user = await getUserById(userId);

  if (!user) {
    reply.status(404).send({ error: 'User not found' });
    return;
  }

  reply.status(200).send(user);
}
// Handle POST /add
export async function addUserHandler(
  request: FastifyRequest<{ Body: { name: string; age: number } }>,
  reply: FastifyReply,
) {
  const { name, age } = request.body;
  const user = await addUser(name, age);

  reply.status(201).send({ message: 'User added successfully', user });
}

// Handle PUT /update/:id
export async function updateUserHandler(
  request: FastifyRequest<{
    Body: { name: string; age: number };
    Params: { id: string };
  }>,
  reply: FastifyReply,
) {
  const { id } = request.params;
  const { name, age } = request.body;
  const updatedUser = await updateUser(id, name, age);

  reply
    .status(200)
    .send({ message: 'User updated successfully', user: updatedUser });
}

// Handle DELETE /delete/:id
export async function deleteUserHandler(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  const { id } = request.params;
  await deleteUser(id);

  reply.status(200).send({ message: 'User deleted successfully' });
}
