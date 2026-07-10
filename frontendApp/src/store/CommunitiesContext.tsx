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
        setCommunities(data)
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
