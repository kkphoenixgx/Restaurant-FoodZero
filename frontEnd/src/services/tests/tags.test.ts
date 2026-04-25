import { describe, it, expect, vi, beforeAll } from 'vitest';
import * as api from '../api';
import { createTag, deleteTag, getTag, listTags, updateTag } from '../tags';

vi.mock('../api');

describe('tags service', () => {
  let createdId = 456;
  const tagData = { name: 'Test Tag' };

  beforeAll(() => {
    (api.apiPost as any).mockResolvedValue({ id: createdId, ...tagData });
    (api.apiGet as any).mockResolvedValueOnce({ id: createdId, ...tagData });
    (api.apiGet as any).mockResolvedValueOnce([{ id: createdId, ...tagData }]);
    (api.apiPut as any).mockResolvedValue({ id: createdId, name: 'Updated Tag' });
    (api.apiDelete as any).mockResolvedValue({ message: 'Tag deleted successfully' });
  });

  it('createTag', async () => {
    const result = await createTag(tagData);
    expect(result).toMatchObject({ id: createdId, name: 'Test Tag' });
  });

  it('getTag', async () => {
    const result = await getTag(createdId);
    expect(result).toMatchObject({ id: createdId, name: 'Test Tag' });
  });

  it('listTags', async () => {
    const result = await listTags();
    expect(result[0]).toMatchObject({ id: createdId, name: 'Test Tag' });
  });

  it('updateTag', async () => {
    const result = await updateTag(createdId, { name: 'Updated Tag' });
    expect(result).toMatchObject({ id: createdId, name: 'Updated Tag' });
  });

  it('deleteTag', async () => {
    const result = await deleteTag(createdId);
    expect(result).toMatchObject({ message: 'Tag deleted successfully' });
  });
});
