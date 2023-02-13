import { useEffect, useState } from 'react';
import { Box, Button, Collapse, Typography, Paper, Divider, AppBar } from '@mui/material';
import { ClickAwayListener } from '@mui/base';
import { useDispatch, useSelector } from 'react-redux'

import { ReactComponent as ArrowDown } from 'assets/vectors/arrow-down.svg'
import { ReactComponent as WalletIcon } from 'assets/vectors/wallet-icon.svg'
import { ReactComponent as LogoHeader } from 'assets/vectors/logo-header.svg'
import Dialog from '../Dialog';

import { headerStyles } from './styles';
import { formatAddress } from 'utils/helpers';
import { useLocation, useNavigate } from 'react-router-dom';
import { CopyAndFollowComponent } from 'components/helpers';
import { HashBasedUserAvatar } from 'components/HashBasedAvatar';
import { RootState } from 'store';
import { updateModalState, initialState as initialModalState } from 'store/modals';
import { initialState, updateUser } from 'store/user';
import { COLORS_DARK_THEME } from 'theme/colors';

const Header = () => {
  const location = useLocation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { address } = useSelector((state: RootState) => state.userState)
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [openMenu, setOpenMenu] = useState<boolean>(false)

  const handleClick = () => {
    if (isConnected) {
      setOpenMenu(!openMenu)
      return;
    }

    dispatch(updateModalState({ selectWallet: true }))
  }

  const handleDisconnect = async () => {
    sessionStorage.clear()
    localStorage.clear()
    dispatch(updateUser(initialState))
    dispatch(updateModalState(initialModalState))
    navigate('/')
  }

  useEffect(() => {
    if (address) {
      setIsConnected(true)
      return
    }

    setIsConnected(false)
  }, [address])

  return (
    <AppBar
      id='header'
      elevation={location.pathname === '/' ? 0 : 10}
      sx={headerStyles.holder}
      component="nav"
    >
      <Dialog />
      <Box
        id='leftNavContent'
        onClick={() => navigate('/')}
        gap={1}
        sx={headerStyles.logoGroup}
      >
        <LogoHeader style={{ height: '32px' }} />
        <Divider
          orientation='vertical'
          sx={headerStyles.divider}
        />
        <Typography fontWeight={700} variant="h6" color="text.primary">
          Private Sale
        </Typography>
      </Box>
      <Box
        id='rightNavContent'
        gap={2}
        sx={{ display: 'flex', alignItems: 'center', position: 'absolute', right: 0, marginRight: '4rem' }}>
        <Box sx={headerStyles.btnHolder}>
          <ClickAwayListener
            onClickAway={() => setOpenMenu(false)}
            children={<Button
              variant="contained"
              style={{ justifyContent: isConnected ? 'space-between' : 'center' }}
              sx={{
                ...headerStyles.logInBtn,
                bgcolor: isConnected ? COLORS_DARK_THEME.PRIMARY_STEEL_GRAY : COLORS_DARK_THEME.PRIMARY_BLUE
              }}
              onMouseEnter={() => isConnected ? setOpenMenu(true) : null}
              onClick={handleClick}
            >
              {isConnected ?
                <HashBasedUserAvatar UID={address!} size={25} /> :
                <WalletIcon style={{ height: '24px', marginRight: '5px' }} />}
              <Typography fontWeight={700}>
                {isConnected ?
                  formatAddress(address!, 7) :
                  "Connect wallet"}
              </Typography>
              {isConnected ?
                <ArrowDown
                  style={{
                    color: COLORS_DARK_THEME.PRIMARY_BLUE,
                    transform: openMenu ? 'rotate(180deg)' : 'rotate(360deg)'
                  }}
                />
                : null}
            </Button>}
          />
          <Collapse
            sx={headerStyles.collapse}
            onMouseEnter={() => setOpenMenu(true)}
            onMouseLeave={() => setOpenMenu(false)}
            in={openMenu}
          >
            <Paper elevation={1} sx={headerStyles.dropDownContentHolder}>
              <Box gap={2} sx={headerStyles.dropDownItemHolder}>
                <HashBasedUserAvatar UID={address!} size={50} />
                <Typography color={COLORS_DARK_THEME.PRIMARY_STEEL_GRAY_20}>
                  {formatAddress(address!, 10)}
                </Typography>
                <CopyAndFollowComponent address={address!} />
                <Button
                  variant="contained"
                  sx={headerStyles.disconnectBtn}
                  onClick={handleDisconnect}
                >
                  Disconnect
                </Button>
              </Box>
            </Paper>
          </Collapse>
        </Box>
      </Box>
    </AppBar>
  );
};

export default Header
