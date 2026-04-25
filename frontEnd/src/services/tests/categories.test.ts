import { describe, it, expect, vi, beforeAll } from 'vitest';
import * as api from '../api';
import { createCategory, deleteCategory, getCategory, listCategories, updateCategory } from '../categories';

vi.mock('../api');

describe('categories service', () => {
  let createdId = 123;
  const categoryData = { name: 'Test Category' };

  beforeAll(() => {
    (api.apiPost as any).mockResolvedValue({ id: createdId, ...categoryData });
    (api.apiGet as any).mockResolvedValueOnce({ id: createdId, ...categoryData });
    (api.apiGet as any).mockResolvedValueOnce([{ id: createdId, ...categoryData }]);
    (api.apiPut as any).mockResolvedValue({ id: createdId, name: 'Updated Category' });
    (api.apiDelete as any).mockResolvedValue({ message: 'Category deleted successfully' });
  });

  it('createCategory', async () => {
    const result = await createCategory(categoryData);
    expect(result).toMatchObject({ id: createdId, name: 'Test Category' });
  });

  it('getCategory', async () => {
    const result = await getCategory(createdId);
    expect(result).toMatchObject({ id: createdId, name: 'Test Category' });
  });

  it('listCategories', async () => {
    const result = await listCategories();
    expect(result[0]).toMatchObject({ id: createdId, name: 'Test Category' });
  });

  it('updateCategory', async () => {
    const result = await updateCategory(createdId, { name: 'Updated Category' });
    expect(result).toMatchObject({ id: createdId, name: 'Updated Category' });
  });

  it('deleteCategory', async () => {
    const result = await deleteCategory(createdId);
    expect(result).toMatchObject({ message: 'Category deleted successfully' });
  });
});
