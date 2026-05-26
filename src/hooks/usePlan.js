import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

export function usePlanCount(userId) {
  const [planCount, setPlanCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCount = async () => {
      const startOfMonth = new Date()
      startOfMonth.setDate(1)
      startOfMonth.setHours(0, 0, 0, 0)
      const { count } = await supabase
        .from('workout_plans')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('created_at', startOfMonth.toISOString())
      setPlanCount(count || 0)
      setLoading(false)
    }
    if (userId) fetchCount()
  }, [userId])

  return { planCount, loading }
}