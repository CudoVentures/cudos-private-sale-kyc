import { Box, Button, Typography } from '@mui/material'
import { Dialog as MuiDialog } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import { CancelRoundedIcon, ModalContainer, styles } from './styles'
import FailureIcon from 'assets/vectors/failure.svg'
import { updateModalState } from 'store/modals'
import { initialState as initialModalState } from 'store/modals'

const Failure = () => {

  const dispatch = useDispatch()

  const {
    failure,
    title,
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
      BackdropProps={styles.defaultBackDrop}
      open={failure!}
      onClose={closeModal}
      PaperProps={styles.defaultPaperProps}
    >
      <ModalContainer sx={{ padding: '4rem' }}>
        <img src={FailureIcon} alt="failure-icon" />
        <CancelRoundedIcon onClick={handleModalClose} />
        <Box
          width='400px'
          minHeight='200px'
          display="block"
          flexDirection="column"
          alignItems="center"
          textAlign="center"
          gap={1}
        >
          <Typography
            style={{ margin: '20px 0 20px 0' }}
            variant="h4"
            fontWeight={900}
            letterSpacing={2}
          >
            {title}
          </Typography>
          {message ?
            <Typography variant="subtitle1" color="text.secondary">
              {message}
            </Typography>
            : null}
        </Box>
        <Button
          variant="contained"
          color="primary"
          sx={() => ({
            width: '50%',
            fontWeight: 700
          })}
          onClick={handleModalClose}
        >
          Close
        </Button>
      </ModalContainer>
    </MuiDialog>
  )
}

export default Failure
