import { Box, Button, Typography } from '@mui/material'
import { Dialog as MuiDialog } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { CancelRoundedIcon, ModalContainer, styles } from './styles'
import { initialState as initialModalState, updateModalState } from 'store/modals'
import { RootState } from 'store'

const TOC = () => {

    const dispatch = useDispatch()

    const {
        openTOC
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
            open={openTOC!}
            onClose={closeModal}
            PaperProps={styles.TOCPaperProps}
        >
            <ModalContainer sx={{ padding: '3rem', height: '100%' }}>
                <CancelRoundedIcon onClick={handleModalClose} />
                <Typography
                marginBottom={2}
                    variant="h4"
                    fontWeight={900}
                    letterSpacing={2}
                >
                    Terms & Conditions
                </Typography>
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    gap={1}
                    sx={{ overflow: 'scroll', height: '100%' }}
                >

                    <Typography variant="subtitle1" color="text.secondary">
                        {'Lorem Ipsum'.repeat(200)}
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    color="secondary"
                    sx={() => ({
                        width: '100%',
                        fontWeight: 700,
                        marginTop: '20px'
                    })}
                    onClick={handleModalClose}
                >
                    Close
                </Button>
            </ModalContainer>
        </MuiDialog>
    )
}

export default TOC
