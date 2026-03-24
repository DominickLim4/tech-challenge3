import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import Modal from '../../components/Modal'
import { Loading } from '../../components/Loading'
import { usePosts, usePostActions } from '../../hooks/usePosts'
import { formatDateShort } from '../../utils/formatDate'
import { truncateText } from '../../utils/truncateText'

const PageWrapper = styled.main`
  max-width: ${({ theme }) => theme.breakpoints.desktop};
  margin: 0 auto;
  padding: ${({ theme }) => `${theme.spacing[10]} ${theme.spacing[6]}`};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: ${({ theme }) => `${theme.spacing[6]} ${theme.spacing[4]}`};
  }
`

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing[8]};
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[4]};
`

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.extrabold};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  }
`

const NewPostButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[5]}`};
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  text-decoration: none;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
    text-decoration: none;
  }
`

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[8]};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`

const StatCard = styled.div`
  background: ${({ theme }) => theme.colors.backgroundCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[5]};
`

const StatValue = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.extrabold};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`

const StatLabel = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 0;
`

const AlertBox = styled.div`
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[4]}`};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  background-color: ${({ $type, theme }) =>
    $type === 'error' ? theme.colors.errorLight : theme.colors.successLight};
  color: ${({ $type, theme }) =>
    $type === 'error' ? theme.colors.error : theme.colors.success};
  border: 1px solid ${({ $type, theme }) =>
    $type === 'error' ? theme.colors.error : theme.colors.success};
`

const TableWrapper = styled.div`
  background: ${({ theme }) => theme.colors.backgroundCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
  overflow-x: auto;
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;
`

const Thead = styled.thead`
  background-color: ${({ theme }) => theme.colors.gray50};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`

const Th = styled.th`
  padding: ${({ theme }) => `${theme.spacing[4]} ${theme.spacing[5]}`};
  text-align: left;
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  white-space: nowrap;
`

const Tr = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  transition: background-color ${({ theme }) => theme.transitions.fast};

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray50};
  }
`

const Td = styled.td`
  padding: ${({ theme }) => `${theme.spacing[4]} ${theme.spacing[5]}`};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text};
  vertical-align: middle;
`

const PostTitle = styled.span`
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text};
`

const PostTitleLink = styled(Link)`
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: underline;
  }
`

const AuthorChip = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.primary};
  background-color: ${({ theme }) => theme.colors.primaryLight};
  padding: ${({ theme }) => `2px ${theme.spacing[2]}`};
  border-radius: ${({ theme }) => theme.borderRadius.full};
`

const ActionsCell = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
  align-items: center;
`

const ActionButton = styled.button`
  padding: ${({ theme }) => `${theme.spacing[1]} ${theme.spacing[3]}`};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  white-space: nowrap;

  ${({ $variant, theme }) =>
    $variant === 'edit'
      ? `
    background-color: transparent;
    color: ${theme.colors.primary};
    border: 1px solid ${theme.colors.primary};
    &:hover { background-color: ${theme.colors.primaryLight}; }
  `
      : `
    background-color: transparent;
    color: ${theme.colors.error};
    border: 1px solid ${theme.colors.error};
    &:hover { background-color: ${theme.colors.errorLight}; }
  `}

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => `${theme.spacing[12]} ${theme.spacing[6]}`};
  color: ${({ theme }) => theme.colors.textSecondary};
`

const EmptyIcon = styled.p`
  font-size: 3rem;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`

const ErrorState = styled.div`
  background-color: ${({ theme }) => theme.colors.errorLight};
  border: 1px solid ${({ theme }) => theme.colors.error};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[6]};
  text-align: center;
  color: ${({ theme }) => theme.colors.error};
`

function AdminPage() {
  const { allPosts: posts, loading, error, refetch } = usePosts()
  const { remove, loading: actionLoading } = usePostActions()
  const navigate = useNavigate()

  const [modal, setModal] = useState({ open: false, postId: null, postTitle: '' })
  const [feedback, setFeedback] = useState({ type: '', message: '' })

  const openDeleteModal = (postId, postTitle) => {
    setModal({ open: true, postId, postTitle })
  }

  const closeModal = () => {
    setModal({ open: false, postId: null, postTitle: '' })
  }

  const handleDelete = async () => {
    try {
      await remove(modal.postId)
      setFeedback({ type: 'success', message: 'Post excluído com sucesso!' })
      closeModal()
      refetch()
      setTimeout(() => setFeedback({ type: '', message: '' }), 4000)
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Erro ao excluir o post.' })
      closeModal()
    }
  }

  if (loading) {
    return <Loading fullPage text="Carregando painel..." />
  }

  return (
    <PageWrapper>
      <PageHeader>
        <PageTitle>Painel Administrativo</PageTitle>
        <NewPostButton to="/admin/create" aria-label="Criar novo post">
          + Novo Post
        </NewPostButton>
      </PageHeader>

      <StatsRow aria-label="Estatísticas">
        <StatCard>
          <StatValue>{posts.length}</StatValue>
          <StatLabel>Total de posts</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>
            {posts.filter((p) => {
              const date = new Date(p.createdAt || p.created_at)
              const now = new Date()
              const diffDays = (now - date) / (1000 * 60 * 60 * 24)
              return diffDays <= 30
            }).length}
          </StatValue>
          <StatLabel>Posts este mês</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>
            {new Set(posts.map((p) =>
              typeof p.author === 'object' ? p.author?.name : p.author
            )).size}
          </StatValue>
          <StatLabel>Autores únicos</StatLabel>
        </StatCard>
      </StatsRow>

      {feedback.message && (
        <AlertBox $type={feedback.type} role="alert" aria-live="polite">
          {feedback.message}
        </AlertBox>
      )}

      {error ? (
        <ErrorState role="alert">
          <p>{error}</p>
        </ErrorState>
      ) : posts.length === 0 ? (
        <TableWrapper>
          <EmptyState>
            <EmptyIcon aria-hidden="true">📝</EmptyIcon>
            <p>Nenhum post publicado ainda.</p>
            <p>
              <Link to="/admin/create">Crie o primeiro post</Link>
            </p>
          </EmptyState>
        </TableWrapper>
      ) : (
        <TableWrapper>
          <Table aria-label="Lista de posts">
            <Thead>
              <tr>
                <Th scope="col">Título</Th>
                <Th scope="col">Autor</Th>
                <Th scope="col">Data</Th>
                <Th scope="col">Ações</Th>
              </tr>
            </Thead>
            <tbody>
              {posts.map((post) => {
                const postId = post._id || post.id
                const authorName =
                  typeof post.author === 'object'
                    ? post.author?.name || post.author?.username
                    : post.author
                const postDate = post.createdAt || post.created_at

                return (
                  <Tr key={postId}>
                    <Td>
                      <PostTitleLink to={`/posts/${postId}`}>
                        <PostTitle>{truncateText(post.title, 60)}</PostTitle>
                      </PostTitleLink>
                    </Td>
                    <Td>
                      {authorName && <AuthorChip>{authorName}</AuthorChip>}
                    </Td>
                    <Td>
                      <time dateTime={postDate}>{formatDateShort(postDate)}</time>
                    </Td>
                    <Td>
                      <ActionsCell>
                        <ActionButton
                          $variant="edit"
                          onClick={() => navigate(`/admin/edit/${postId}`)}
                          aria-label={`Editar "${post.title}"`}
                          disabled={actionLoading}
                        >
                          Editar
                        </ActionButton>
                        <ActionButton
                          $variant="delete"
                          onClick={() => openDeleteModal(postId, post.title)}
                          aria-label={`Excluir "${post.title}"`}
                          disabled={actionLoading}
                        >
                          Excluir
                        </ActionButton>
                      </ActionsCell>
                    </Td>
                  </Tr>
                )
              })}
            </tbody>
          </Table>
        </TableWrapper>
      )}

      <Modal
        isOpen={modal.open}
        onClose={closeModal}
        onConfirm={handleDelete}
        title="Confirmar exclusão"
        message={`Tem certeza que deseja excluir o post "${modal.postTitle}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        isLoading={actionLoading}
        variant="danger"
      />
    </PageWrapper>
  )
}

export default AdminPage
