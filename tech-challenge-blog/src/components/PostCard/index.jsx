import { Link } from 'react-router-dom'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { formatDate } from '../../utils/formatDate'
import { truncateText } from '../../utils/truncateText'

const Card = styled.article`
  background: ${({ theme }) => theme.colors.backgroundCard};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[6]};
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: all ${({ theme }) => theme.transitions.normal};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};
  height: 100%;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => theme.shadows.md};
    transform: translateY(-2px);
  }
`

const CardLink = styled(Link)`
  text-decoration: none;
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: ${({ theme }) => theme.spacing[3]};

  &:hover {
    text-decoration: none;
  }
`

const CardMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  flex-wrap: wrap;
`

const AuthorName = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.primary};
  background-color: ${({ theme }) => theme.colors.primaryLight};
  padding: ${({ theme }) => `2px ${theme.spacing[2]}`};
  border-radius: ${({ theme }) => theme.borderRadius.full};
`

const PostDate = styled.time`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textMuted};
`

const CardTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

const CardDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  flex: 1;
  margin-bottom: 0;
`

const ReadMore = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.primary};
  margin-top: auto;
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};

  &::after {
    content: '→';
    transition: transform ${({ theme }) => theme.transitions.fast};
  }

  ${Card}:hover & {
    &::after {
      transform: translateX(4px);
    }
  }
`

function PostCard({ id, title, author, description, createdAt }) {
  const authorName = typeof author === 'object' ? author?.name || author?.username : author

  return (
    <Card>
      <CardLink to={`/posts/${id}`} aria-label={`Ler post: ${title}`}>
        <CardMeta>
          {authorName && (
            <AuthorName aria-label={`Autor: ${authorName}`}>{authorName}</AuthorName>
          )}
          {createdAt && (
            <PostDate dateTime={createdAt} aria-label={`Publicado em ${formatDate(createdAt)}`}>
              {formatDate(createdAt)}
            </PostDate>
          )}
        </CardMeta>

        <CardTitle>{title}</CardTitle>

        {description && (
          <CardDescription>{truncateText(description, 150)}</CardDescription>
        )}

        <ReadMore aria-hidden="true">Ler mais</ReadMore>
      </CardLink>
    </Card>
  )
}

PostCard.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  title: PropTypes.string.isRequired,
  author: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({ name: PropTypes.string, username: PropTypes.string }),
  ]),
  description: PropTypes.string,
  createdAt: PropTypes.string,
}

export default PostCard
