import type { Community, CommunityProfile, CreateCommunityPayload } from '../types/community'
import { mockCreateCommunityAdmin } from './auth.mock'

const communities: Community[] = [
  {
    id: 'c1',
    name: 'Lekki Gardens Estate',
    state: 'Lagos',
    lga: 'Eti-Osa',
    adminName: 'Ngozi Adeyemi',
    status: 'active',
    housesCount: 312,
    createdAt: '2026-01-02',
  },
  {
    id: 'c2',
    name: 'Greenwood Court',
    state: 'Lagos (Ikeja)',
    lga: 'Municipal',
    adminName: 'Tunde Bakare',
    status: 'active',
    housesCount: 184,
    createdAt: '2026-04-14',
  },
  {
    id: 'c3',
    name: 'Harmony Heights',
    state: 'lagos',
    lga: 'Eti-osa',
    adminName: 'Chidi Umeh',
    status: 'pending_setup',
    housesCount: 96,
    createdAt: '2026-02-20',
  },
  {
    id: 'c4',
    name: 'Palm View Residences',
    state: 'Lagos',
    lga: 'Ikorodu',
    adminName: 'Blessing Okafor',
    status: 'active',
    housesCount: 210,
    createdAt: '2026-02-08',
  },
  {
    id: 'c5',
    name: 'Sunrise Meadows',
    state: 'Lagos',
    lga: 'ketu',
    adminName: 'Femi Balogun',
    status: 'pending_setup',
    housesCount: 58,
    createdAt: '2026-07-01',
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
    'Journalist Estate is a premium apartment complex nestled in the heart of the Highland District. Founded in 2018, it offers world-class facilities including a smart security system, sustainable energy solutions, and a community-focused management approach.',
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
  await mockCreateCommunityAdmin({
    name: payload.adminName,
    email: payload.adminEmail,
    temporaryPassword: payload.temporaryPassword,
  })

  await delay(600)

  const community: Community = {
    id: `c${communities.length + 1}`,
    name: payload.name,
    state: payload.state,
    lga: payload.lga,
    adminName: payload.adminName,
    status: 'pending_setup',
    housesCount: 0,
    createdAt: new Date().toISOString().slice(0, 10),
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
