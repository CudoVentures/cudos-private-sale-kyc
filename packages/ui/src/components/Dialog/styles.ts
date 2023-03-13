import { styled, Box } from '@mui/material'
import { CancelRounded } from '@mui/icons-material'
import { COLORS_DARK_THEME } from 'theme/colors'

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
    padding: '30px 57px',
    borderRadius: '20px',
    zIndex: 1,
}))

export const styles = {
    defaultBackDrop: {
        style: {
            backgroundColor: 'transparent',
            backdropFilter: 'blur(3px)',
            opacity: 1,
        },
    },
    loadingProps: {
        sx: {
            background: 'transparent',
            boxShadow: 'none',
            position: 'fixed',
            overflow: 'hidden',
            borderRadius: '25px',
        },
    },
    TOCPaperProps: {
        sx: {
            boxShadow: 'none',
            width: 'max-content',
            minWidth: '500px',
            background: COLORS_DARK_THEME.PRIMARY_DARK_BLUE_80,
            overflow: 'hidden',
            borderRadius: '25px',
            height: '100%',
            maxHeight: '1080px'
        },
    },
    defaultPaperProps: {
        sx: {
            boxShadow: 'none',
            width: 'max-content',
            minWidth: '500px',
            background: COLORS_DARK_THEME.PRIMARY_DARK_BLUE_80,
            height: 'min-content',
            overflow: 'hidden',
            borderRadius: '25px',
        },
    },
    loadingModalContainer: {
        minWidth: '600px',
        minHeight: '300px',
        padding: '4rem',
    },
}

export const walletSelectorStyles = {
    pluginWarning: {
        maxWidth: '550px',
        fontSize: '14px',
        height: '60px',
        backgroundColor: 'rgba(82, 166, 248, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        borderRadius: '10px',
        padding: '10px 20px 10px 20px',
        marginBottom: '10px',
    },
    infoIcon: {
        display: 'flex',
        marginRight: '10px',
    },
    connectButton: {
        height: '50px',
        width: '90%'
    },
    btnsHolder: {
        alignItems: 'center',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
    },
    keplrLogo: {
        marginRight: '10px',
    },
    cosmostationLogo: {
        marginRight: '10px',
        height: '25px',
    },
    contentHolder: {
        width: '100%',
        minHeight: '200px',
        display: 'block',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
    },
} as const
