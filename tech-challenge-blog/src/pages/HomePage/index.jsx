import { useState, useCallback } from 'react'
import styled from 'styled-components'
import PostCard from '../../components/PostCard'
import SearchBar from '../../components/SearchBar'
import { PostsGridSkeleton } from '../../components/Loading'
import { usePosts } from '../../hooks/usePosts'

const PageWrapper = styled.main`
  max-width: ${({ theme }) => theme.breakpoints.desktop};
  margin: 0 auto;
  padding: ${({ theme }) => `${theme.spacing[10]} ${theme.spacing[6]}`};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: ${({ theme }) => `${theme.spacing[6]} ${theme.spacing[4]}`};
  }
`

const PageHeader = styled.section`
  margin-bottom: ${({ theme }) => theme.spacing[10]};
`

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['4xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.extrabold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing[3]};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  }
`

const PageSubtitle = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  margin-bottom: ${({ theme }) => theme.spacing[6]};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: ${({ theme }) => theme.typography.fontSize.base};
  }
`

const SearchRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: stretch;
  }
`

const ResultsInfo = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  white-space: nowrap;
`

const PostsGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: ${({ theme }) => theme.spacing[6]};
  margin-bottom: ${({ theme }) => theme.spacing[10]};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing[4]};
  }
`

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => `${theme.spacing[16]} ${theme.spacing[6]}`};
  color: ${({ theme }) => theme.colors.textSecondary};
`

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`

const EmptyTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`

const EmptyMessage = styled.p`
  margin-bottom: 0;
`

const ErrorState = styled.div`
  background-color: ${({ theme }) => theme.colors.errorLight};
  border: 1px solid ${({ theme }) => theme.colors.error};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[6]};
  text-align: center;
  color: ${({ theme }) => theme.colors.error};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`

const RetryButton = styled.button`
  margin-top: ${({ theme }) => theme.spacing[3]};
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[4]}`};
  background-color: ${({ theme }) => theme.colors.error};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background-color: #b91c1c;
  }
`

const Pagination = styled.nav`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-top: ${({ theme }) => theme.spacing[8]};
`

const PageButton = styled.button`
  min-width: 40px;
  height: 40px;
  padding: 0 ${({ theme }) => theme.spacing[3]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  border: 2px solid ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.border};
  background-color: ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.backgroundCard};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.white : theme.colors.textSecondary};

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ $active, theme }) => ($active ? theme.colors.white : theme.colors.primary)};
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`

function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const {
    posts,
    allPosts,
    loading,
    error,
    currentPage,
    totalPages,
    setCurrentPage,
    refetch,
  } = usePosts(searchQuery)

  const handleSearch = useCallback((query) => {
    setSearchQuery(query)
  }, [])

  return (
    <PageWrapper>
      <PageHeader>
        <PageTitle>Blog Educacional</PageTitle>
        <PageSubtitle>
          Descubra artigos e conhecimentos compartilhados por nossos professores
        </PageSubtitle>

        <SearchRow>
          <SearchBar onSearch={handleSearch} />
          {!loading && !error && (
            <ResultsInfo aria-live="polite" aria-atomic="true">
              {allPosts.length === 0
                ? 'Nenhum post encontrado'
                : `${allPosts.length} post${allPosts.length !== 1 ? 's' : ''} encontrado${allPosts.length !== 1 ? 's' : ''}`}
            </ResultsInfo>
          )}
        </SearchRow>
      </PageHeader>

      {loading && <PostsGridSkeleton count={6} />}

      {!loading && error && (
        <ErrorState role="alert">
          <p>{error}</p>
          <RetryButton onClick={refetch}>Tentar novamente</RetryButton>
        </ErrorState>
      )}

      {!loading && !error && posts.length === 0 && (
        <EmptyState>
          <EmptyIcon aria-hidden="true">📭</EmptyIcon>
          <EmptyTitle>Nenhum post encontrado</EmptyTitle>
          <EmptyMessage>
            {searchQuery
              ? `Nenhum resultado para "${searchQuery}". Tente outra busca.`
              : 'Ainda não há posts publicados. Volte em breve!'}
          </EmptyMessage>
        </EmptyState>
      )}

      {!loading && !error && posts.length > 0 && (
        <>
          <PostsGrid aria-label="Lista de posts">
            {posts.map((post) => (
              <PostCard
                key={post._id || post.id}
                id={post._id || post.id}
                title={post.title}
                author={post.author}
                description={post.content || post.description || post.excerpt}
                createdAt={post.createdAt || post.created_at}
              />
            ))}
          </PostsGrid>

          {totalPages > 1 && (
            <Pagination aria-label="Navegação de páginas">
              <PageButton
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                aria-label="Página anterior"
              >
                ←
              </PageButton>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PageButton
                  key={page}
                  $active={page === currentPage}
                  onClick={() => setCurrentPage(page)}
                  aria-label={`Página ${page}`}
                  aria-current={page === currentPage ? 'page' : undefined}
                >
                  {page}
                </PageButton>
              ))}

              <PageButton
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                aria-label="Próxima página"
              >
                →
              </PageButton>
            </Pagination>
          )}
        </>
      )}
    </PageWrapper>
  )
}

export default HomePage
