import { useState, useEffect, useCallback } from 'react'

export function useFetch(fetchFn, deps = []) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const execute = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetchFn()
      setData(response.data)
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        'Ocorreu um erro inesperado. Tente novamente.'
      setError(message)
    } finally {
      setLoading(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => {
    execute()
  }, [execute])

  return { data, loading, error, refetch: execute }
}
