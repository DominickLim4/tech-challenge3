import styled, { keyframes } from 'styled-components'
import PropTypes from 'prop-types'

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
`

const SpinnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[4]};
  padding: ${({ theme }) => theme.spacing[8]};
  min-height: ${({ $fullPage }) => ($fullPage ? '60vh' : 'auto')};
`

const Spinner = styled.div`
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  border: 3px solid ${({ theme }) => theme.colors.gray200};
  border-top-color: ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 0.7s linear infinite;
`

const SpinnerText = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`

const SkeletonBase = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`

const SkeletonBlock = styled.div`
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.gray200} 25%,
    ${({ theme }) => theme.colors.gray100} 50%,
    ${({ theme }) => theme.colors.gray200} 75%
  );
  background-size: 200px 100%;
  animation: ${SkeletonBase} 1.4s ease infinite;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  height: ${({ $height }) => $height || '20px'};
  width: ${({ $width }) => $width || '100%'};
`

const SkeletonCard = styled.div`
  background: ${({ theme }) => theme.colors.backgroundCard};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[6]};
  border: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};
  animation: ${pulse} 1.5s ease-in-out infinite;
`

const SkeletonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: ${({ theme }) => theme.spacing[6]};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`

export function Loading({ fullPage = false, text = 'Carregando...', size = 40 }) {
  return (
    <SpinnerWrapper $fullPage={fullPage} role="status" aria-live="polite">
      <Spinner $size={size} aria-hidden="true" />
      <SpinnerText>{text}</SpinnerText>
    </SpinnerWrapper>
  )
}

Loading.propTypes = {
  fullPage: PropTypes.bool,
  text: PropTypes.string,
  size: PropTypes.number,
}

export function PostCardSkeleton() {
  return (
    <SkeletonCard aria-hidden="true">
      <SkeletonBlock $height="24px" $width="60%" />
      <SkeletonBlock $height="16px" $width="40%" />
      <SkeletonBlock $height="16px" />
      <SkeletonBlock $height="16px" />
      <SkeletonBlock $height="16px" $width="80%" />
    </SkeletonCard>
  )
}

export function PostsGridSkeleton({ count = 6 }) {
  return (
    <SkeletonGrid aria-label="Carregando posts..." aria-busy="true">
      {Array.from({ length: count }, (_, i) => (
        <PostCardSkeleton key={i} />
      ))}
    </SkeletonGrid>
  )
}

PostsGridSkeleton.propTypes = {
  count: PropTypes.number,
}

export default Loading
