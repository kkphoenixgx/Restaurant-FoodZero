import { describe, it, expect, vi, beforeAll } from 'vitest';
import * as api from '../api';
import {
  getUser,
  listUsers,
  createUser,
  updateUser,
  deleteUser
} from '../user.ts';

vi.mock('../api');

describe('user service', () => {
  let createdId = 111;
  const userData = { name: 'Test User', email: 'test@example.com', senha: '123', userImagePath: null, phone: '123456', role: 'user' };

  beforeAll(() => {
    (api.apiPost as any).mockResolvedValue({ id: createdId, ...userData });
    (api.apiGet as any).mockResolvedValueOnce({ id: createdId, ...userData });
    (api.apiGet as any).mockResolvedValueOnce([{ id: createdId, ...userData }]);
    (api.apiPut as any).mockResolvedValue({ id: createdId, ...userData, name: 'Updated User' });
    (api.apiDelete as any).mockResolvedValue({ message: 'User deleted successfully' });
  });

  it('createUser', async () => {
    const result = await createUser(userData);
    expect(result).toMatchObject({ id: createdId, name: 'Test User' });
  });

  it('getUser', async () => {
    const result = await getUser(createdId);
    expect(result).toMatchObject({ id: createdId, name: 'Test User' });
  });

  it('listUsers', async () => {
    const result = await listUsers();
    expect(result[0]).toMatchObject({ id: createdId, name: 'Test User' });
  });

  it('updateUser', async () => {
    const result = await updateUser(createdId, { ...userData, name: 'Updated User' });
    expect(result).toMatchObject({ id: createdId, name: 'Updated User' });
  });

  it('deleteUser', async () => {
    const result = await deleteUser(createdId);
    expect(result).toMatchObject({ message: 'User deleted successfully' });
  });
});
