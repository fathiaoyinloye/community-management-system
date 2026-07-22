import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Community, CreateCommunityPayload } from '../types/community'
import { createCommunity as createCommunityRequest, getCommunities } from '../api/community'

interface CommunitiesContextValue {
  communities: Community[]
  isLoading: boolean
  createCommunity: (payload: CreateCommunityPayload) => Promise<Community>
}

const CommunitiesContext = createContext<CommunitiesContextValue | null>(null)

export function CommunitiesProvider({ children }: { children: ReactNode }) {
  const [communities, setCommunities] = useState<Community[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    getCommunities().then((data) => {
      if (!cancelled) {
        const storedAdmins = localStorage.getItem("ct_community_admins");
        const admins = storedAdmins ? JSON.parse(storedAdmins) : [];
        const enriched = data.map((c) => {
          const admin = admins.find((a: any) => a.communityId === c.id);
          return {
            ...c,
            adminName: admin ? `${admin.firstName} ${admin.lastName}` : undefined,
            status: admin ? ("active" as const) : ("pending_setup" as const),
          };
        });
        setCommunities(enriched)
        setIsLoading(false)
      }
    })

    return () => {
      cancelled = true
    }
  }, [])

  const createCommunity = async (payload: CreateCommunityPayload) => {
    const community = await createCommunityRequest(payload)
    setCommunities((current) => [community, ...current])
    return community
  }

  const value = useMemo(
    () => ({ communities, isLoading, createCommunity }),
    [communities, isLoading],
  )

  return <CommunitiesContext.Provider value={value}>{children}</CommunitiesContext.Provider>
}

export function useCommunities() {
  const ctx = useContext(CommunitiesContext)
  if (!ctx) {
    throw new Error('useCommunities must be used within a CommunitiesProvider')
  }
  return ctx
}
