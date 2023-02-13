import { CircularProgress, Typography, Dialog as MuiDialog } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import { updateModalState } from 'store/modals'
import { ModalContainer, styles } from './styles'
import { initialState as initialModalState } from 'store/modals'

const Loading = () => {

  const dispatch = useDispatch()

  const {
    loading,
    title,
    loadingType,
    message
  } = useSelector((state: RootState) => state.modalState)

  const handleModalClose = () => {
    dispatch(updateModalState({ ...initialModalState }))
  }

  const closeModal = (event: {}, reason: string) => {
    if (reason !== 'backdropClick') {
      handleModalClose()
    }
  }

  return (
    <MuiDialog
      BackdropProps={loadingType ? undefined : styles.defaultBackDrop}
      open={loading!}
      onClose={closeModal}
      PaperProps={loadingType ? styles.loadingProps : styles.defaultPaperProps}
      style={{ top: '25%' }}
    >
      <ModalContainer sx={{
        backgroundColor: loadingType ? 'transparent' : "default",
        ...styles.loadingModalContainer
      }}>
        <CircularProgress thickness={5} sx={{ borderRadius: '20px' }} />
        <Typography
          style={{ margin: '20px 0 20px 0' }}
          variant="h4"
          fontWeight={900}
          letterSpacing={2}
        >
          {loadingType ? "Loading..." : title ? title : "Processing..."}
        </Typography>
        {
          message ?
            <Typography color="primary.main" fontWeight={900} letterSpacing={1}>
              {message}
            </Typography>
            : null
        }
      </ModalContainer>
    </MuiDialog>
  )
}

export default Loading
