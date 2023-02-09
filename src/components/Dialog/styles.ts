import { styled, Box } from '@mui/material'
import { CancelRounded } from '@mui/icons-material'

export const CancelRoundedIcon = styled(CancelRounded)(({ theme }) => ({
    color: theme.palette.text.secondary,
    position: 'absolute',
    top: 32,
    right: 32,
    cursor: 'pointer'
  }))

export const ModalContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    background: theme.custom.backgrounds.primary,
    padding: '30px 57px',
    borderRadius: '20px',
    boxShadow: '2px 10px 20px rgba(2, 6, 20, 0.6)',
    zIndex: 1
}))

export const styles = {
    defaultBackDrop: {
        style: {
            backgroundColor: 'transparent',
            backdropFilter: "blur(6px)",
            opacity: 1
        }
    },
    loadingProps: {
        sx: {
            background: 'transparent',
            boxShadow: 'none',
            position: 'fixed',
            overflow: 'hidden',
            borderRadius: '25px'
        }
    },
    defaultPaperProps: {
        sx: {
            background: 'transparent',
            width: '100%',
            height: 'min-content',
            position: 'absolute',
            top: '1%',
            overflow: 'hidden',
            borderRadius: '25px'
        }
    },
    loadingModalContainer: {
        minWidth: '600px',
        minHeight: '300px',
        padding: '4rem'
    },
}