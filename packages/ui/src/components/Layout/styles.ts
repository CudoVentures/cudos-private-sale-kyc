import { styled, Box } from '@mui/material'
import theme from 'theme'
import { COLORS_DARK_THEME } from 'theme/colors'

export const themeStyles = {
  centerFlexLinear: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center'
  },
  icons: {
    marginLeft: '10px',
    cursor: 'pointer'
  },
  iconHolder: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    width: '48px',
    height: '48px',
    padding: '12px',
    borderRadius: '50%',
    background: COLORS_DARK_THEME.PRIMARY_STEEL_GRAY
  }
}

export const helperStyles = {
  footerLogo: {
    display: 'flex',
    color: COLORS_DARK_THEME.PRIMARY_STEEL_GRAY_50,
    alignItems: 'center',
    "&:hover": {
      color: COLORS_DARK_THEME.PRIMARY_BLUE
    }
  },
  dropDownItem: {
    width: '100%',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'flex-start',
    padding: '8px',
  },
  defaultSvgIcon: {
    height: '18px',
    marginRight: '5px',
  },
  imgHolder: {
    overflow: 'clip',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%'
  }
}

export const headerStyles = {
  disconnectBtn: {
    width: '195px',
    height: '45px',
    borderRadius: '100px'
  },
  logoGroup: {
    position: 'absolute',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center'
  },
  divider: {
    height: '24px',
    backgroundColor: COLORS_DARK_THEME.PRIMARY_STEEL_GRAY
  },
  dropDownItemHolder: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    padding: '8px 0px'
  },
  dropDownContentHolder: {
    padding: '10px 20px',
    background: COLORS_DARK_THEME.PRIMARY_STEEL_GRAY_100,
    fontSize: '14px',
    width: '100%',
    fontWeight: '500',
    borderRadius: '24px',
    display: 'flex',
    height: 'max-content',
    justifyContent: 'center',
  },
  collapse: {
    position: 'absolute',
    marginTop: '24px',
    zIndex: '-1',
    width: '224px',
  },
  SMcollapse: {
    cursor: 'pointer',
    position: 'absolute',
    marginTop: '55px',
    minWidth: '100%',
    zIndex: '-1',
  },
  holderLowRes: {
    padding: '16px 4rem',
    justifyContent: 'space-between',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    background: "rgba(16, 18, 26, 0.8)",
    backdropFilter: 'blur(12px)'
  },
  holder: {
    position: 'fixed',
    left: 0,
    minWidth: '950px',
    width: '100vw',
    height: '80px',
    padding: '16px 4rem',
    justifyContent: 'space-between',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    background: "rgba(16, 18, 26, 0.3)",
    backdropFilter: 'blur(10px)'
  },
  btnHolder: {
    zIndex: '10',
    width: '224px',
  },
  logInBtn: {
    padding: '10px 20px 10px 12px',
    borderRadius: '100px',
    height: '40px',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    textTransform: 'none',
  },
}

export const layoutStyles = {
  contentWrapper: {
    justifyContent: 'center',
    position: 'absolute',
    width: '100%',
    overflowWrap: 'break-word',
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column'
  },
  contentHolder: {
    display: 'flex',
    justifyContent: 'center',

  },
  appWrapper: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    minWidth: '650px'
  }
}

export const footerStyles = {
  typography: {
    fontWeight: 700,
    color: COLORS_DARK_THEME.PRIMARY_STEEL_GRAY_50,
    "&:hover": {
      color: COLORS_DARK_THEME.PRIMARY_BLUE
    }
  },
  holder: {
    padding: '1rem 2rem',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignItems: 'center',
    display: 'flex'
  },
  rightItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: COLORS_DARK_THEME.PRIMARY_STEEL_GRAY_50,
    '&:hover': {
      color: COLORS_DARK_THEME.PRIMARY_BLUE
    }
  },
  leftItem: {
    cursor: 'pointer'
  }
}

export const styles = {
  disconnectBtnHolder: {
    display: 'flex',
    justifyContent: 'center',
  },
  userAddressHolder: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '10px',
    flexDirection: 'column'
  },
  anchorStyle: {
    alignItems: 'center',
    textDecoration: 'none',
    display: 'flex'
  },
  networkInfoHolder: {
    width: 'max-content',
    marginRight: '20px',
    display: 'flex',
    alignItems: 'center'
  },
  avatarStyling: {
    borderRadius: "0px",
    width: '18px',
    height: '18px'
  },
  menuContainer: {
    background: theme.dark.custom.backgrounds.primary,
    width: '88px',
    borderRadius: '1.3rem',
    height: '100%',
    padding: '20px',
    flexShrink: 0
  },
  userContainer: {
    padding: '12px 20px',
    position: 'relative',
    background: theme.dark.custom.backgrounds.primary,
    borderRadius: '35px',
    maxWidth: '100%',
    maxHeight: '48px'
  },
  userInnerContainer: {
    fontSize: '14px',
    fontWeight: '500',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: "center"
  },
  fancyLine: {
    border: "none",
    borderLeft: "2px solid #414963",
    height: "20px",
    margin: "0 15px 0 15px"
  },
  dropdownMenuContainer: {
    background: theme.dark.custom.backgrounds.light,
    float: 'right',
    fontSize: '14px',
    height: 'max-content',
    minWidth: '100%',
    fontWeight: '500',
    display: 'flex',
    borderRadius: '0px 0px 20px 20px',
    marginTop: '3px',
    justifyContent: 'center'
  },
  networkSelectionMenuContainer: {
    background: theme.dark.custom.backgrounds.light,
    fontSize: '14px',
    minWidth: '224px',
    fontWeight: '500',
    display: 'flex',
    borderRadius: '0px 0px 20px 20px',
    paddingLeft: '20px',
    marginTop: '3px',
    padding: '40px 0px 20px 20px',
    flexDirection: 'column'
  },
  footerContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 0,
    right: 0,
    left: 0,
    width: 'inherit',
    padding: '1rem'
  }
} as const

export const StyledNetwork = styled(Box)(({ theme }) => ({
  maxWidth: '100%',
  minWidth: '250px',
  maxHeight: '48px',
  borderRadius: '55px',
  height: '35px',
  marginRight: '20px',
  backgroundColor: theme.custom.backgrounds.primary,
  zIndex: '10'
}))

export const StyledUser = styled(Box)(({ theme }) => ({
  minWidth: '224px',
  maxHeight: '48px',
  borderRadius: '55px',
  height: '35px',
  background: theme.custom.backgrounds.primary,
  zIndex: '10',
  cursor: 'default'
}))
