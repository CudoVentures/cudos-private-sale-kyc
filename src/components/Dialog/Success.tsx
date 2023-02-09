import { RootState } from 'store'
import { Box, Button, Typography } from '@mui/material'
import { Dialog as MuiDialog } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import SuccessIcon from 'assets/vectors/success.svg'
import { useNavigate } from 'react-router-dom'
import { CancelRoundedIcon, ModalContainer, styles } from './styles'
import { initialState as initialModalState, updateModalState } from 'store/modals'

const Success = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const {
    success,
    message,
    msgType,
  } = useSelector((state: RootState) => state.modalState)

  const contentComponentHandler = (msgType: string): JSX.Element => {

    let contentComponent: JSX.Element = (<div></div>)
    
    switch (msgType) {

      //TODO: Handle various msgType successes

      default:
        return contentComponent
    }

  }

  const handleModalClose = () => {
    dispatch(updateModalState({ ...initialModalState }))
    navigate("/welcome")
  }

  const closeModal = (event: {}, reason: string) => {
    if (reason !== 'backdropClick') {
      handleModalClose()
    }
  }

  return (
    <MuiDialog
      BackdropProps={styles.defaultBackDrop}
      open={success!}
      onClose={closeModal}
      PaperProps={styles.defaultPaperProps}
    >
      <ModalContainer sx={{ padding: '4rem' }}>
        <img src={SuccessIcon} alt="success-icon" />
        <CancelRoundedIcon onClick={handleModalClose} />
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap={1}
        >
          <Typography
            variant="h4"
            fontWeight={900}
            letterSpacing={2}
          >
            Success!
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {message}
          </Typography>
        </Box>
        {contentComponentHandler(msgType!)}
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

export default Success
