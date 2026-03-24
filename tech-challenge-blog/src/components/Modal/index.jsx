import { useEffect, useCallback } from 'react'
import styled, { keyframes } from 'styled-components'
import PropTypes from 'prop-types'

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`

const slideIn = keyframes`
  from { opacity: 0; transform: translateY(-20px) scale(0.96); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: ${({ theme }) => theme.colors.overlay};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing[4]};
  z-index: ${({ theme }) => theme.zIndex.modal};
  animation: ${fadeIn} ${({ theme }) => theme.transitions.fast};
`

const ModalContainer = styled.div`
  background: ${({ theme }) => theme.colors.backgroundCard};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing[8]};
  width: 100%;
  max-width: 480px;
  box-shadow: ${({ theme }) => theme.shadows.xl};
  animation: ${slideIn} ${({ theme }) => theme.transitions.fast};
`

const ModalTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`

const ModalMessage = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
`

const ModalActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
  justify-content: flex-end;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column-reverse;
  }
`

const Button = styled.button`
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[5]}`};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  transition: all ${({ theme }) => theme.transitions.fast};
  cursor: pointer;

  ${({ $variant, theme }) =>
    $variant === 'danger'
      ? `
    background-color: ${theme.colors.error};
    color: ${theme.colors.white};
    border: 2px solid ${theme.colors.error};
    &:hover { background-color: #b91c1c; border-color: #b91c1c; }
  `
      : `
    background-color: transparent;
    color: ${theme.colors.textSecondary};
    border: 2px solid ${theme.colors.border};
    &:hover { background-color: ${theme.colors.gray100}; }
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

function Modal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  isLoading = false,
  variant = 'danger',
}) {
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose]
  )

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, handleKeyDown])

  if (!isOpen) return null

  return (
    <Overlay onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalTitle id="modal-title">{title}</ModalTitle>
        <ModalMessage>{message}</ModalMessage>
        <ModalActions>
          <Button onClick={onClose} disabled={isLoading}>
            {cancelLabel}
          </Button>
          <Button $variant={variant} onClick={onConfirm} disabled={isLoading}>
            {isLoading ? 'Aguarde...' : confirmLabel}
          </Button>
        </ModalActions>
      </ModalContainer>
    </Overlay>
  )
}

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  confirmLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  isLoading: PropTypes.bool,
  variant: PropTypes.oneOf(['danger', 'warning']),
}

export default Modal
