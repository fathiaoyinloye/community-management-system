import type { House, HouseSummary, RegisterHousePayload, AssignResidentPayload } from '../types/house'
import type { UserActivationResponse } from '../types/auth'
import { apiUrl } from './config'

export async function getHouses(
  keyword?: string,
  tab?: 'all' | 'residential' | 'commercial' | 'vacant',
): Promise<{ houses: House[]; summary: HouseSummary }> {
  const response = await fetch(apiUrl('/houses'), { credentials: 'include' })
  if (!response.ok) throw new Error('Unable to load houses.')
  const allHouses = await response.json() as House[]

  // Enrich with localStorage resident details, alerts, and vacated status
  let enriched = allHouses.map((house) => {
    // 1. Check if manually marked vacant in localStorage
    const isManualVacant = localStorage.getItem(`vacated_house_${house.id}`) === 'true';
    const residentId = isManualVacant ? null : house.residentId;

    // 2. Load resident info
    let resident: any = undefined;
    if (residentId) {
      const storedResident = localStorage.getItem(`resident_${residentId}`);
      if (storedResident) {
        resident = JSON.parse(storedResident);
      } else {
        // fallback placeholder
        resident = {
          firstName: 'Resident',
          lastName: `(ID: ${residentId.slice(0, 6)})`,
          email: '',
          phone: '',
        };
      }
    }

    // 3. Load maintenance alert
    const hasMaintenanceAlert = localStorage.getItem(`house_alert_${house.id}`) === 'true';

    return {
      ...house,
      residentId,
      resident,
      status: residentId ? ('occupied' as const) : ('vacant' as const),
      propertyType: 'single_family' as const, // default
      hasMaintenanceAlert,
    };
  });

  // Filter by tab
  if (tab === 'vacant') {
    enriched = enriched.filter((h) => h.status === 'vacant');
  } else if (tab === 'residential') {
    enriched = enriched.filter((h) => h.propertyType !== 'commercial');
  } else if (tab === 'commercial') {
    enriched = enriched.filter((h) => h.propertyType === 'commercial');
  }

  // Filter by keyword
  if (keyword) {
    const kw = keyword.toLowerCase();
    enriched = enriched.filter((h) => {
      const matchesNum = h.houseNumber.toLowerCase().includes(kw);
      const matchesStreet = h.street.toLowerCase().includes(kw);
      const matchesRes = h.resident && `${h.resident.firstName} ${h.resident.lastName}`.toLowerCase().includes(kw);
      return matchesNum || matchesStreet || matchesRes;
    });
  }

  // Calculate summary
  const totalInventory = allHouses.length;
  const occupiedCount = allHouses.filter(h => {
    const isManualVacant = localStorage.getItem(`vacated_house_${h.id}`) === 'true';
    return !isManualVacant && !!h.residentId;
  }).length;
  const vacantCount = totalInventory - occupiedCount;
  const maintenanceAlertCount = allHouses.filter(h => localStorage.getItem(`house_alert_${h.id}`) === 'true').length;

  const summary: HouseSummary = {
    totalInventory,
    occupiedCount,
    vacantCount,
    maintenanceAlertCount,
    occupancyRate: totalInventory > 0 ? Math.round((occupiedCount / totalInventory) * 1000) / 10 : 0,
  };

  return { houses: enriched, summary };
}

export async function registerHouse(payload: RegisterHousePayload): Promise<House> {
  const response = await fetch(apiUrl('/houses'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.message ?? 'Unable to register house.')
  }

  return response.json() as Promise<House>
}

export async function assignResident(
  houseId: string,
  payload: AssignResidentPayload,
): Promise<UserActivationResponse> {
  const response = await fetch(apiUrl(`/houses/${houseId}/assign-resident`), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.message ?? 'Unable to assign resident.')
  }

  const data = await response.json() as UserActivationResponse;

  // Save resident info in localStorage for future display lookup
  localStorage.setItem(`resident_${data.userId}`, JSON.stringify({
    firstName: payload.firstName,
    lastName: payload.lastName,
    email: payload.email,
    phone: payload.phone,
  }));

  // Clear manual vacancy if it was set
  localStorage.removeItem(`vacated_house_${houseId}`);

  return data;
}
