import * as repo from "./user.repository.js";
import { HttpError } from "../../utils/httpError.js";

export async function createUser(data: { name: string; email: string }) {
  return repo.insertUser(data);
}

export async function getUserById(id: number) {
  const user = await repo.getUserById(id);
  if (!user) throw new HttpError(404, "User not found");
  return user;
}
export const getUser = getUserById;
export const listUsers = (limit?: number, offset?: number) => repo.listUsers(limit, offset);
