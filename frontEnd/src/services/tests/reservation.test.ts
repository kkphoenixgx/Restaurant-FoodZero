import { describe, it, expect, vi, beforeAll } from 'vitest';
import * as api from '../api';
import {
  getReservation,
  listReservations,
  createReservation,
  updateReservation,
  deleteReservation
} from '../reservation';

vi.mock('../api');

describe('reservation service', () => {
  let createdId = 987;
  const reservationData = { reservationTime: '2025-06-07T12:00:00Z', personsQuantity: 2, user: {} };

  beforeAll(() => {
    (api.apiPost as any).mockResolvedValue({ id: createdId, ...reservationData });
    (api.apiGet as any).mockResolvedValueOnce({ id: createdId, ...reservationData });
    (api.apiGet as any).mockResolvedValueOnce([{ id: createdId, ...reservationData }]);
    (api.apiPut as any).mockResolvedValue({ id: createdId, ...reservationData, personsQuantity: 3 });
    (api.apiDelete as any).mockResolvedValue({ message: 'Reservation deleted successfully' });
  });

  it('createReservation', async () => {
    const result = await createReservation(reservationData);
    expect(result).toMatchObject({ id: createdId, personsQuantity: 2 });
  });

  it('getReservation', async () => {
    const result = await getReservation(createdId);
    expect(result).toMatchObject({ id: createdId, personsQuantity: 2 });
  });

  it('listReservations', async () => {
    const result = await listReservations();
    expect(result[0]).toMatchObject({ id: createdId, personsQuantity: 2 });
  });

  it('updateReservation', async () => {
    const result = await updateReservation(createdId, { ...reservationData, personsQuantity: 3 });
    expect(result).toMatchObject({ id: createdId, personsQuantity: 3 });
  });

  it('deleteReservation', async () => {
    const result = await deleteReservation(createdId);
    expect(result).toMatchObject({ message: 'Reservation deleted successfully' });
  });
});
