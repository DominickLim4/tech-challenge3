import { useState } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { useAuth } from '../../hooks/useAuth'

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[6]};
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
`

const Label = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text};
`

const Required = styled.span`
  color: ${({ theme }) => theme.colors.error};
  margin-left: 2px;
`

const Input = styled.input`
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[4]}`};
  border: 2px solid ${({ $hasError, theme }) =>
    $hasError ? theme.colors.error : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ theme }) => theme.colors.backgroundCard};
  transition: border-color ${({ theme }) => theme.transitions.fast};
  width: 100%;

  &:focus {
    outline: none;
    border-color: ${({ $hasError, theme }) =>
      $hasError ? theme.colors.error : theme.colors.primary};
    box-shadow: ${({ $hasError, theme }) =>
      $hasError ? '0 0 0 3px rgba(220, 38, 38, 0.15)' : theme.shadows.focus};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.gray100};
    cursor: not-allowed;
  }
`

const Textarea = styled.textarea`
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[4]}`};
  border: 2px solid ${({ $hasError, theme }) =>
    $hasError ? theme.colors.error : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ theme }) => theme.colors.backgroundCard};
  transition: border-color ${({ theme }) => theme.transitions.fast};
  resize: vertical;
  min-height: 300px;
  width: 100%;
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};

  &:focus {
    outline: none;
    border-color: ${({ $hasError, theme }) =>
      $hasError ? theme.colors.error : theme.colors.primary};
    box-shadow: ${({ $hasError, theme }) =>
      $hasError ? '0 0 0 3px rgba(220, 38, 38, 0.15)' : theme.shadows.focus};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.gray100};
    cursor: not-allowed;
  }
`

const ErrorText = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.error};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
`

const HintText = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textMuted};
`

const CharCount = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ $isOver, theme }) => $isOver ? theme.colors.error : theme.colors.textMuted};
  text-align: right;
`

const FormActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
  justify-content: flex-end;
  padding-top: ${({ theme }) => theme.spacing[4]};
  border-top: 1px solid ${({ theme }) => theme.colors.border};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column-reverse;
  }
`

const Button = styled.button`
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[6]}`};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  min-width: 120px;

  ${({ $primary, theme }) =>
    $primary
      ? `
    background-color: ${theme.colors.primary};
    color: ${theme.colors.white};
    border: 2px solid ${theme.colors.primary};
    &:hover:not(:disabled) { background-color: ${theme.colors.primaryDark}; border-color: ${theme.colors.primaryDark}; }
  `
      : `
    background-color: transparent;
    color: ${theme.colors.textSecondary};
    border: 2px solid ${theme.colors.border};
    &:hover:not(:disabled) { background-color: ${theme.colors.gray100}; }
  `}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 100%;
    justify-content: center;
  }
`

const TITLE_MIN = 5
const TITLE_MAX = 200
const CONTENT_MIN = 20

function validate(fields) {
  const errors = {}

  if (!fields.title?.trim()) {
    errors.title = 'Título é obrigatório.'
  } else if (fields.title.trim().length < TITLE_MIN) {
    errors.title = `Título deve ter no mínimo ${TITLE_MIN} caracteres.`
  } else if (fields.title.trim().length > TITLE_MAX) {
    errors.title = `Título deve ter no máximo ${TITLE_MAX} caracteres.`
  }

  if (!fields.content?.trim()) {
    errors.content = 'Conteúdo é obrigatório.'
  } else if (fields.content.trim().length < CONTENT_MIN) {
    errors.content = `Conteúdo deve ter no mínimo ${CONTENT_MIN} caracteres.`
  }

  if (!fields.author?.trim()) {
    errors.author = 'Autor é obrigatório.'
  }

  return errors
}

function PostForm({ initialData = {}, onSubmit, onCancel, isLoading = false }) {
  const { user } = useAuth()

  // Initialise once from props — EditPostPage ensures props are ready before rendering
  const [fields, setFields] = useState(() => ({
    title: initialData.title || '',
    content: initialData.content || '',
    author: initialData.author || user?.name || user?.username || '',
  }))

  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  const isEditing = Boolean(initialData.title)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFields((prev) => ({ ...prev, [name]: value }))

    if (touched[name]) {
      const newErrors = validate({ ...fields, [name]: value })
      setErrors((prev) => ({ ...prev, [name]: newErrors[name] }))
    }
  }

  const handleBlur = (e) => {
    const { name } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    const newErrors = validate(fields)
    setErrors((prev) => ({ ...prev, [name]: newErrors[name] }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    setTouched({ title: true, content: true, author: true })

    const validationErrors = validate(fields)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) return

    onSubmit({
      title: fields.title.trim(),
      content: fields.content.trim(),
      author: fields.author.trim(),
    })
  }

  const titleOver = fields.title.length > TITLE_MAX

  return (
    <Form onSubmit={handleSubmit} noValidate aria-label="Formulário de post">
      <FormGroup>
        <Label htmlFor="post-title">
          Título <Required aria-hidden="true">*</Required>
        </Label>
        <Input
          id="post-title"
          name="title"
          type="text"
          value={fields.title}
          onChange={handleChange}
          onBlur={handleBlur}
          $hasError={Boolean(touched.title && errors.title)}
          disabled={isLoading}
          placeholder="Digite o título do post"
          aria-required="true"
          aria-invalid={Boolean(touched.title && errors.title)}
          aria-describedby={errors.title ? 'title-error' : 'title-hint'}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {touched.title && errors.title ? (
            <ErrorText id="title-error" role="alert">⚠ {errors.title}</ErrorText>
          ) : (
            <HintText id="title-hint">Mínimo {TITLE_MIN} caracteres</HintText>
          )}
          <CharCount $isOver={titleOver}>
            {fields.title.length}/{TITLE_MAX}
          </CharCount>
        </div>
      </FormGroup>

      <FormGroup>
        <Label htmlFor="post-author">
          Autor <Required aria-hidden="true">*</Required>
        </Label>
        <Input
          id="post-author"
          name="author"
          type="text"
          value={fields.author}
          onChange={handleChange}
          onBlur={handleBlur}
          $hasError={Boolean(touched.author && errors.author)}
          disabled={isLoading}
          placeholder="Nome do autor"
          aria-required="true"
          aria-invalid={Boolean(touched.author && errors.author)}
          aria-describedby={errors.author ? 'author-error' : undefined}
        />
        {touched.author && errors.author && (
          <ErrorText id="author-error" role="alert">⚠ {errors.author}</ErrorText>
        )}
      </FormGroup>

      <FormGroup>
        <Label htmlFor="post-content">
          Conteúdo <Required aria-hidden="true">*</Required>
        </Label>
        <Textarea
          id="post-content"
          name="content"
          value={fields.content}
          onChange={handleChange}
          onBlur={handleBlur}
          $hasError={Boolean(touched.content && errors.content)}
          disabled={isLoading}
          placeholder="Escreva o conteúdo completo do post..."
          aria-required="true"
          aria-invalid={Boolean(touched.content && errors.content)}
          aria-describedby={errors.content ? 'content-error' : 'content-hint'}
        />
        {touched.content && errors.content ? (
          <ErrorText id="content-error" role="alert">⚠ {errors.content}</ErrorText>
        ) : (
          <HintText id="content-hint">Mínimo {CONTENT_MIN} caracteres</HintText>
        )}
      </FormGroup>

      <FormActions>
        {onCancel && (
          <Button type="button" onClick={onCancel} disabled={isLoading}>
            Cancelar
          </Button>
        )}
        <Button type="submit" $primary disabled={isLoading} aria-busy={isLoading}>
          {isLoading ? 'Salvando...' : isEditing ? 'Salvar alterações' : 'Publicar post'}
        </Button>
      </FormActions>
    </Form>
  )
}

PostForm.propTypes = {
  initialData: PropTypes.shape({
    title: PropTypes.string,
    content: PropTypes.string,
    author: PropTypes.string,
  }),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  isLoading: PropTypes.bool,
}

export default PostForm
