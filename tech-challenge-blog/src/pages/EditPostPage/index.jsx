import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import styled from 'styled-components'
import PostForm from '../../components/PostForm'
import { Loading } from '../../components/Loading'
import { usePost, usePostActions } from '../../hooks/usePosts'

const PageWrapper = styled.main`
  max-width: 800px;
  margin: 0 auto;
  padding: ${({ theme }) => `${theme.spacing[10]} ${theme.spacing[6]}`};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: ${({ theme }) => `${theme.spacing[6]} ${theme.spacing[4]}`};
  }
`

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
  text-decoration: none;
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
  }
`

const PageHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[8]};
  padding-bottom: ${({ theme }) => theme.spacing[6]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.extrabold};
  margin-bottom: ${({ theme }) => theme.spacing[2]};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  }
`

const PageSubtitle = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 0;
`

const AlertBox = styled.div`
  padding: ${({ theme }) => `${theme.spacing[4]} ${theme.spacing[5]}`};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  background-color: ${({ $type, theme }) =>
    $type === 'error' ? theme.colors.errorLight : theme.colors.successLight};
  color: ${({ $type, theme }) =>
    $type === 'error' ? theme.colors.error : theme.colors.success};
  border: 1px solid ${({ $type, theme }) =>
    $type === 'error' ? theme.colors.error : theme.colors.success};

  a {
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    color: inherit;
    text-decoration: underline;
  }
`

const ErrorContainer = styled.div`
  text-align: center;
  padding: ${({ theme }) => `${theme.spacing[12]} ${theme.spacing[6]}`};
`

function EditPostPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { post, loading: postLoading, error: postError } = usePost(id)
  const { update, loading: updateLoading } = usePostActions()
  const [feedback, setFeedback] = useState({ type: '', message: '' })

  if (postLoading) {
    return <Loading fullPage text="Carregando post para edição..." />
  }

  if (postError) {
    return (
      <PageWrapper>
        <BackLink to="/admin">← Voltar ao painel</BackLink>
        <ErrorContainer>
          <h2>Erro ao carregar post</h2>
          <p>{postError}</p>
        </ErrorContainer>
      </PageWrapper>
    )
  }

  const handleSubmit = async (data) => {
    setFeedback({ type: '', message: '' })

    try {
      await update(id, data)
      setFeedback({
        type: 'success',
        message: 'Post atualizado com sucesso! Redirecionando...',
      })
      setTimeout(() => navigate('/admin'), 2000)
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.message || 'Erro ao atualizar o post. Tente novamente.',
      })
    }
  }

  const initialData = post
    ? {
        title: post.title || '',
        content: post.content || '',
        author:
          typeof post.author === 'object'
            ? post.author?.name || post.author?.username || ''
            : post.author || '',
      }
    : {}

  return (
    <PageWrapper>
      <BackLink to="/admin">← Voltar ao painel</BackLink>

      <PageHeader>
        <PageTitle>Editar post</PageTitle>
        <PageSubtitle>Atualize as informações do post abaixo.</PageSubtitle>
      </PageHeader>

      {feedback.message && (
        <AlertBox $type={feedback.type} role="alert" aria-live="polite">
          {feedback.message}
          {feedback.type === 'success' && (
            <>
              {' '}
              <Link to="/admin">Ir para o painel agora</Link>
            </>
          )}
        </AlertBox>
      )}

      {post && (
        <PostForm
          initialData={initialData}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/admin')}
          isLoading={updateLoading}
        />
      )}
    </PageWrapper>
  )
}

export default EditPostPage
