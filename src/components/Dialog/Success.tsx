import { useState } from 'react'
import jsPDF from "jspdf"
import { Box, Button, Typography } from '@mui/material'
import { Dialog as MuiDialog } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import SuccessIcon from 'assets/vectors/success.svg'
import { useNavigate } from 'react-router-dom'
import { CancelRoundedIcon, ModalContainer, styles } from './styles'
import { initialState as initialModalState, updateModalState } from 'store/modals'
import { RootState } from 'store'

const Success = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const {
    success,
    message,
    data
  } = useSelector((state: RootState) => state.modalState)

  const handleModalClose = () => {
    dispatch(updateModalState({ ...initialModalState }))
    navigate("/welcome")
  }

  const closeModal = (event: {}, reason: string) => {
    if (reason !== 'backdropClick') {
      handleModalClose()
    }
  }

  const downloadPDF = () => {
    setIsLoading(true)
    const doc = new jsPDF()
    let index = 0;
    for (const [key, value] of Object.entries(data)) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      const keyLength = doc.getStringUnitWidth(key) * 5;
      doc.text(`${key}:`, 10, 10 + index * 10);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      const wrappedValue = doc.splitTextToSize(JSON.stringify(value).replaceAll('"', ""), 150);
      doc.text(wrappedValue, 20 + keyLength, 10 + index * 10);
      index += 1;
    }
    doc.save("my-file.pdf")
    setIsLoading(false)
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
        <Button
          variant="contained"
          color="primary"
          sx={() => ({
            width: '100%',
            fontWeight: 700,
            marginTop: '20px'
          })}
          onClick={handleModalClose}
        >
          Close
        </Button>
        {!data ? null :
          <Button
            disabled={isLoading}
            variant="outlined"
            color="secondary"
            sx={() => ({
              width: '50%',
              fontWeight: 700,
              marginTop: '20px'
            })}
            onClick={downloadPDF}
          >
            Download PDF
          </Button>
        }
      </ModalContainer>
    </MuiDialog>
  )
}

export default Success
