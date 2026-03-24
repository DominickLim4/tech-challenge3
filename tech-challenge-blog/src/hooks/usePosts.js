import { useState, useEffect, useCallback } from 'react'
import { getPosts, getPostById, createPost, updatePost, deletePost } from '../services/api'

export function usePosts(searchQuery = '') {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const postsPerPage = 9

  const fetchPosts = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const params = {}
      if (searchQuery) params.search = searchQuery

      const response = await getPosts(params)
      const allPosts = response.data?.posts || response.data || []

      setPosts(allPosts)
      setTotalPages(Math.ceil(allPosts.length / postsPerPage))
      setCurrentPage(1)
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Erro ao carregar os posts. Tente novamente.'
      )
    } finally {
      setLoading(false)
    }
  }, [searchQuery])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  const paginatedPosts = posts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  )

  return {
    posts: paginatedPosts,
    allPosts: posts,
    loading,
    error,
    currentPage,
    totalPages,
    setCurrentPage,
    refetch: fetchPosts,
  }
}

export function usePost(id) {
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return

    const fetchPost = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await getPostById(id)
        setPost(response.data?.post || response.data)
      } catch (err) {
        if (err.response?.status === 404) {
          setError('Post não encontrado.')
        } else {
          setError(
            err.response?.data?.message ||
            'Erro ao carregar o post. Tente novamente.'
          )
        }
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [id])

  return { post, loading, error }
}

export function usePostActions() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const create = useCallback(async (data) => {
    setLoading(true)
    setError(null)

    try {
      const response = await createPost(data)
      return response.data?.post || response.data
    } catch (err) {
      const message = err.response?.data?.message || 'Erro ao criar o post.'
      setError(message)
      throw new Error(message)
    } finally {
      setLoading(false)
    }
  }, [])

  const update = useCallback(async (id, data) => {
    setLoading(true)
    setError(null)

    try {
      const response = await updatePost(id, data)
      return response.data?.post || response.data
    } catch (err) {
      const message = err.response?.data?.message || 'Erro ao atualizar o post.'
      setError(message)
      throw new Error(message)
    } finally {
      setLoading(false)
    }
  }, [])

  const remove = useCallback(async (id) => {
    setLoading(true)
    setError(null)

    try {
      await deletePost(id)
    } catch (err) {
      const message = err.response?.data?.message || 'Erro ao excluir o post.'
      setError(message)
      throw new Error(message)
    } finally {
      setLoading(false)
    }
  }, [])

  return { create, update, remove, loading, error }
}
