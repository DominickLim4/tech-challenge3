import { useParams, Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { Loading } from '../../components/Loading'
import { usePost } from '../../hooks/usePosts'
import { useAuth } from '../../hooks/useAuth'
import { formatDate } from '../../utils/formatDate'

const PageWrapper = styled.main`
  max-width: 800px;
  margin: 0 auto;
  padding: ${({ theme }) => `${theme.spacing[10]} ${theme.spacing[6]}`};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: ${({ theme }) => `${theme.spacing[6]} ${theme.spacing[4]}`};
  }
`

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
  text-decoration: none;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    gap: ${({ theme }) => theme.spacing[3]};
  }
`

const PostHeader = styled.header`
  margin-bottom: ${({ theme }) => theme.spacing[8]};
  padding-bottom: ${({ theme }) => theme.spacing[8]};
  border-bottom: 2px solid ${({ theme }) => theme.colors.border};
`

const PostMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  flex-wrap: wrap;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`

const AuthorBadge = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.primary};
  background-color: ${({ theme }) => theme.colors.primaryLight};
  padding: ${({ theme }) => `${theme.spacing[1]} ${theme.spacing[3]}`};
  border-radius: ${({ theme }) => theme.borderRadius.full};
`

const PostDate = styled.time`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`

const Separator = styled.span`
  color: ${({ theme }) => theme.colors.border};
`

const PostTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['4xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.extrabold};
  color: ${({ theme }) => theme.colors.text};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  }
`

const PostContent = styled.article`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  color: ${({ theme }) => theme.colors.text};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: ${({ theme }) => theme.typography.fontSize.base};
  }

  p {
    margin-bottom: ${({ theme }) => theme.spacing[4]};
  }

  h2, h3, h4 {
    margin-top: ${({ theme }) => theme.spacing[8]};
    margin-bottom: ${({ theme }) => theme.spacing[4]};
  }
`

const ContentParagraphs = styled.div`
  white-space: pre-wrap;
  word-break: break-word;
`

const AdminActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
  margin-top: ${({ theme }) => theme.spacing[8]};
  padding-top: ${({ theme }) => theme.spacing[6]};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`

const ActionButton = styled(Link)`
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[4]}`};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  text-decoration: none;
  transition: all ${({ theme }) => theme.transitions.fast};
  background-color: ${({ $variant, theme }) =>
    $variant === 'edit' ? theme.colors.primary : 'transparent'};
  color: ${({ $variant, theme }) =>
    $variant === 'edit' ? theme.colors.white : theme.colors.textSecondary};
  border: 2px solid ${({ $variant, theme }) =>
    $variant === 'edit' ? theme.colors.primary : theme.colors.border};

  &:hover {
    text-decoration: none;
    opacity: 0.85;
  }
`

const ErrorContainer = styled.div`
  text-align: center;
  padding: ${({ theme }) => `${theme.spacing[16]} ${theme.spacing[6]}`};
`

const ErrorTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`

const HomeLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[6]}`};
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  text-decoration: none;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
    text-decoration: none;
  }
`

function PostDetailPage() {
  const { id } = useParams()
  const { post, loading, error } = usePost(id)
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  if (loading) {
    return <Loading fullPage text="Carregando post..." />
  }

  if (error) {
    return (
      <PageWrapper>
        <ErrorContainer>
          <ErrorTitle>
            {error.includes('não encontrado') ? '404 — Post não encontrado' : 'Erro'}
          </ErrorTitle>
          <ErrorMessage>{error}</ErrorMessage>
          <HomeLink to="/">← Voltar ao início</HomeLink>
        </ErrorContainer>
      </PageWrapper>
    )
  }

  if (!post) return null

  const authorName = typeof post.author === 'object'
    ? post.author?.name || post.author?.username
    : post.author

  const postDate = post.createdAt || post.created_at

  const handleBack = (e) => {
    e.preventDefault()
    if (window.history.length > 2) {
      navigate(-1)
    } else {
      navigate('/')
    }
  }

  return (
    <PageWrapper>
      <BackButton to="/" onClick={handleBack} aria-label="Voltar para a lista de posts">
        ← Voltar
      </BackButton>

      <PostHeader>
        <PostMeta>
          {authorName && (
            <AuthorBadge aria-label={`Autor: ${authorName}`}>{authorName}</AuthorBadge>
          )}
          {postDate && (
            <>
              <Separator aria-hidden="true">·</Separator>
              <PostDate dateTime={postDate}>
                Publicado em {formatDate(postDate)}
              </PostDate>
            </>
          )}
          {post.updatedAt && post.updatedAt !== post.createdAt && (
            <>
              <Separator aria-hidden="true">·</Separator>
              <PostDate dateTime={post.updatedAt}>
                Atualizado em {formatDate(post.updatedAt)}
              </PostDate>
            </>
          )}
        </PostMeta>

        <PostTitle>{post.title}</PostTitle>
      </PostHeader>

      <PostContent>
        <ContentParagraphs>{post.content}</ContentParagraphs>
      </PostContent>

      {isAuthenticated && (
        <AdminActions aria-label="Ações de administrador">
          <ActionButton
            $variant="edit"
            to={`/admin/edit/${post._id || post.id}`}
            aria-label="Editar este post"
          >
            Editar post
          </ActionButton>
        </AdminActions>
      )}
    </PageWrapper>
  )
}

export default PostDetailPage
