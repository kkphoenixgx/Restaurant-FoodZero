import { describe, it, expect, vi, beforeAll } from 'vitest';
import * as api from '../api';
import {
  getPost,
  listPosts,
  createPost,
  updatePost,
  deletePost
} from '../post';

vi.mock('../api');

describe('post service', () => {
  let createdId = 654;
  const postData = { date: '2025-06-07', description: 'Test Post', user: {}, tags: [] };

  beforeAll(() => {
    (api.apiPost as any).mockResolvedValue({ id: createdId, ...postData });
    (api.apiGet as any).mockResolvedValueOnce({ id: createdId, ...postData });
    (api.apiGet as any).mockResolvedValueOnce([{ id: createdId, ...postData }]);
    (api.apiPut as any).mockResolvedValue({ id: createdId, ...postData, description: 'Updated Post' });
    (api.apiDelete as any).mockResolvedValue({ message: 'Post deleted successfully' });
  });

  it('createPost', async () => {
    const result = await createPost(postData);
    expect(result).toMatchObject({ id: createdId, description: 'Test Post' });
  });

  it('getPost', async () => {
    const result = await getPost(createdId);
    expect(result).toMatchObject({ id: createdId, description: 'Test Post' });
  });

  it('listPosts', async () => {
    const result = await listPosts();
    expect(result[0]).toMatchObject({ id: createdId, description: 'Test Post' });
  });

  it('updatePost', async () => {
    const result = await updatePost(createdId, { ...postData, description: 'Updated Post' });
    expect(result).toMatchObject({ id: createdId, description: 'Updated Post' });
  });

  it('deletePost', async () => {
    const result = await deletePost(createdId);
    expect(result).toMatchObject({ message: 'Post deleted successfully' });
  });
});
