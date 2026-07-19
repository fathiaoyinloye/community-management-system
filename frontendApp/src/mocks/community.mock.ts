import type { Community, CommunityProfile, CreateCommunityPayload } from '../types/community'

const communities: Community[] = [
  {
    id: 'c1',
    name: 'Lekki Gardens Estate',
    type: 'gated_estate',
    address: '1 Admiralty Way, Lekki Phase 1',
    state: 'Lagos',
    lga: 'Eti-Osa',
    phone: '+2348031234567',
    email: 'admin@lekkigardens.ng',
    description: '',
    createdAt: '2026-01-02',
    adminName: 'Ngozi Adeyemi',
    status: 'active',
    housesCount: 312,
  },
  {
    id: 'c2',
    name: 'Greenwood Court',
    type: 'apartment_complex',
    address: '22 Oba Akran Avenue',
    state: 'Lagos',
    lga: 'Ikeja',
    phone: '+2348059876543',
    email: 'info@greenwoodcourt.ng',
    description: '',
    createdAt: '2026-04-14',
    adminName: 'Tunde Bakare',
    status: 'active',
    housesCount: 184,
  },
  {
    id: 'c3',
    name: 'Harmony Heights',
    type: 'residential_association',
    address: '45 Ozumba Mbadiwe Street',
    state: 'Lagos',
    lga: 'Eti-Osa',
    phone: '+2348072345678',
    email: 'heights@harmony.ng',
    description: '',
    createdAt: '2026-02-20',
    adminName: 'Chidi Umeh',
    status: 'pending_setup',
    housesCount: 96,
  },
]

let communityProfile: CommunityProfile = {
  id: 'c1',
  name: 'Journalist Estate',
  type: 'apartment_complex',
  address: '128 Maplewood Avenue, Phase 2, Highland District',
  state: 'Lagos State',
  lga: 'Arepo',
  phone: '+234 809 123 4567',
  email: 'admin@journalist.com',
  description:
    'Journalist Estate is a premium apartment complex nestled in the heart of the Highland District',
  logoUrl: null,
  profileCompleteness: 65,
  isPublic: true,
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function mockGetCommunities(): Promise<Community[]> {
  await delay(600)
  return communities
}

export async function mockCreateCommunity(payload: CreateCommunityPayload): Promise<Community> {
  await delay(600)
  const community: Community = {
    id: `c${communities.length + 1}`,
    name: payload.name,
    type: payload.type,
    address: payload.address,
    state: payload.state,
    lga: payload.lga,
    phone: payload.phone,
    email: payload.email,
    description: payload.description,
    createdAt: new Date().toISOString().slice(0, 10),
    status: 'pending_setup',
    housesCount: 0,
  }
  communities.unshift(community)
  return community
}

export async function mockGetCommunityProfile(): Promise<CommunityProfile> {
  await delay(500)
  return communityProfile
}

export async function mockUpdateCommunityProfile(updates: CommunityProfile): Promise<CommunityProfile> {
  await delay(900)
  communityProfile = updates
  return communityProfile
}
