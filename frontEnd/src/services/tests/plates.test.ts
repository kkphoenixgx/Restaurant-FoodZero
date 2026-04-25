import { describe, it, expect, vi, beforeAll } from 'vitest';
import * as api from '../api';
import {
  getPlate,
  listPlates,
  getCategoriesByPlate,
  getPlatesByCategory,
  createPlate,
  updatePlate,
  deletePlate
} from '../plates';

vi.mock('../api');

describe('plates service', () => {
  let createdId = 321;
  const plateData = { name: 'Test Plate', value: 10, description: 'desc', imagePath: 'img.png' };

  beforeAll(() => {
    (api.apiPost as any).mockResolvedValue({ id: createdId, ...plateData });
    (api.apiGet as any).mockResolvedValueOnce({ id: createdId, ...plateData });
    (api.apiGet as any).mockResolvedValueOnce([{ id: createdId, ...plateData }]);
    (api.apiGet as any).mockResolvedValueOnce([1, 2]);
    (api.apiGet as any).mockResolvedValueOnce([{ id: createdId, ...plateData }]);
    (api.apiPut as any).mockResolvedValue({ id: createdId, ...plateData, name: 'Updated Plate' });
    (api.apiDelete as any).mockResolvedValue({ message: 'Plate deleted successfully' });
  });

  it('createPlate', async () => {
    const result = await createPlate(plateData);
    expect(result).toMatchObject({ id: createdId, name: 'Test Plate' });
  });

  it('getPlate', async () => {
    const result = await getPlate(createdId);
    expect(result).toMatchObject({ id: createdId, name: 'Test Plate' });
  });

  it('listPlates', async () => {
    const result = await listPlates();
    expect(result[0]).toMatchObject({ id: createdId, name: 'Test Plate' });
  });

  it('getCategoriesByPlate', async () => {
    const result = await getCategoriesByPlate(createdId);
    expect(result).toEqual([1, 2]);
  });

  it('getPlatesByCategory', async () => {
    const result = await getPlatesByCategory(1);
    expect(result[0]).toMatchObject({ id: createdId, name: 'Test Plate' });
  });

  it('updatePlate', async () => {
    const result = await updatePlate(createdId, { ...plateData, name: 'Updated Plate' });
    expect(result).toMatchObject({ id: createdId, name: 'Updated Plate' });
  });

  it('deletePlate', async () => {
    const result = await deletePlate(createdId);
    expect(result).toMatchObject({ message: 'Plate deleted successfully' });
  });
});
