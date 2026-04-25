import { describe, it, expect, vi, beforeAll } from 'vitest';
import * as api from '../api';
import {
  getOne,
  getAll,
  getComentariesFromAPost,
  getComentariesFromUser,
  postComentary,
  updateComentary,
  deleteComentary
} from '../comentaries';

vi.mock('../api');

describe('comentaries service', () => {
  let createdId = 789;
  const comentaryData = { date: '2025-06-07', description: 'Test Comentary', postId: 1, userId: 1 };

  beforeAll(() => {
    (api.apiPost as any).mockResolvedValue({ id: createdId, ...comentaryData });
    (api.apiGet as any).mockResolvedValueOnce({ id: createdId, ...comentaryData });
    (api.apiGet as any).mockResolvedValueOnce([{ id: createdId, ...comentaryData }]);
    (api.apiGet as any).mockResolvedValueOnce([{ id: createdId, ...comentaryData }]);
    (api.apiGet as any).mockResolvedValueOnce([{ id: createdId, ...comentaryData }]);
    (api.apiPut as any).mockResolvedValue({ id: createdId, ...comentaryData, description: 'Updated Comentary' });
    (api.apiDelete as any).mockResolvedValue({ message: 'Comentary deleted successfully' });
  });

  it('postComentary', async () => {
    const result = await postComentary(comentaryData);
    expect(result).toMatchObject({ id: createdId, description: 'Test Comentary' });
  });

  it('getOne', async () => {
    const result = await getOne(createdId);
    expect(result).toMatchObject({ id: createdId, description: 'Test Comentary' });
  });

  it('getAll', async () => {
    const result = await getAll();
    expect(result[0]).toMatchObject({ id: createdId, description: 'Test Comentary' });
  });

  it('getComentariesFromAPost', async () => {
    const result = await getComentariesFromAPost(1);
    expect(result[0]).toMatchObject({ id: createdId, description: 'Test Comentary' });
  });

  it('getComentariesFromUser', async () => {
    const result = await getComentariesFromUser(1);
    expect(result[0]).toMatchObject({ id: createdId, description: 'Test Comentary' });
  });

  it('updateComentary', async () => {
    const result = await updateComentary(createdId, { ...comentaryData, description: 'Updated Comentary' });
    expect(result).toMatchObject({ id: createdId, description: 'Updated Comentary' });
  });

  it('deleteComentary', async () => {
    const result = await deleteComentary(createdId);
    expect(result).toMatchObject({ message: 'Comentary deleted successfully' });
  });
});
