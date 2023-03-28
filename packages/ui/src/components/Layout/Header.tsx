import { useEffect, useState } from 'react';
import { Box, Button, Collapse, Typography, Paper, Divider, AppBar } from '@mui/material';
import { ClickAwayListener } from '@mui/base';
import { useDispatch, useSelector } from 'react-redux'

import { ReactComponent as ArrowDown } from 'assets/vectors/arrow-down.svg'
import { ReactComponent as WalletIcon } from 'assets/vectors/wallet-icon.svg'
import { ReactComponent as AuraPoolLogo } from 'assets/vectors/aura-pool-logo.svg'
import Dialog from '../Dialog';

import { headerStyles } from './styles';
import { formatAddress } from 'utils/helpers';
import { useLocation, useNavigate } from 'react-router-dom';
import { CopyAndFollowComponent } from 'components/helpers';
import { HashBasedUserAvatar } from 'components/HashBasedAvatar';
import { RootState } from 'store';
import { updateModalState, initialState as initialModalState } from 'store/modals';
import { initialState as initialRatesState } from 'store/rates';
import { initialState, updateUser, userState } from 'store/user';
import { COLORS_DARK_THEME } from 'theme/colors';
import { updateRates } from 'store/rates';
import { getFlowStatus, sanitizeKycStatus } from 'utils/onfido';
import { getLatestWorkflowStatusFromOnfido } from 'api/calls';
import StatusStarter from 'components/StatusStarter';

const Header = () => {
  const location = useLocation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { address: connectedAddress, registrationState } = useSelector((state: RootState) => state.userState)
  const userState = useSelector((state: RootState) => state.userState)
  const {
    failure: modalFailure,
    success: modalSuccess,
    loading: appLevelLoading,
    onfidoModalOpen
  } = useSelector((state: RootState) => state.modalState)
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [openMenu, setOpenMenu] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)

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
    dispatch(updateRates(initialRatesState))
    dispatch(updateUser(initialState))
    dispatch(updateModalState(initialModalState))
    navigate('/')
  }

  useEffect(() => {
    if (connectedAddress) {
      setIsConnected(true)
      return
    }

    setIsConnected(false)
  }, [connectedAddress])

  useEffect(() => {
    if (connectedAddress) {
      (async () => {
        const { applicandId, workflowId, kycStatus: DbStatus, processCompleted } = await getFlowStatus(connectedAddress)
        let latestStatus = DbStatus
        if (workflowId) {
          const onfidoStatus = await getLatestWorkflowStatusFromOnfido(connectedAddress, workflowId)
          if (onfidoStatus) {
            latestStatus = onfidoStatus
          }
        }
        const updatedUser = {
          ...userState,
          registrationState: {
            ...userState.registrationState,
            kycApplicantId: applicandId,
            kycWorkflowRunId: workflowId,
            kycStatus: sanitizeKycStatus(latestStatus),
            processCompleted: processCompleted
          }
        }
        dispatch(updateUser(updatedUser as userState))
        setLoading(false)
      })()
    }
    setLoading(false)
    //eslint-disable-next-line
  }, [loading, modalFailure, modalSuccess, onfidoModalOpen])

  return (
    <AppBar
      id='header'
      elevation={location.pathname === '/' ? 0 : 10}
      sx={{ ...headerStyles.holder, zIndex: onfidoModalOpen ? 'auto' : '999' }}
      component="nav"
    >
      <Dialog />
      <Box
        id='leftNavContent'
        onClick={() => !isConnected ? navigate('/') : null}
        gap={1.5}
        sx={headerStyles.logoGroup}
      >
        <AuraPoolLogo style={{ height: '50px', marginTop: 4 }} />
        <Divider
          orientation='vertical'
          sx={headerStyles.divider}
        />
        <Typography fontWeight={900} variant="h6" color="text.primary">
          Private Sale
        </Typography>
      </Box>
      {appLevelLoading ? null :
        <Box
          id='rightNavContent'
          gap={1}
          sx={{ display: 'flex', alignItems: 'center', position: 'absolute', right: 0, marginRight: '4rem' }}>
          {!connectedAddress || loading || registrationState?.processCompleted ? null :
            <StatusStarter status={registrationState!.kycStatus} outlined={true} />}
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
                  <HashBasedUserAvatar UID={connectedAddress!} size={25} /> :
                  <WalletIcon style={{ height: '24px', marginRight: '5px' }} />}
                <Typography fontWeight={700}>
                  {isConnected ?
                    formatAddress(connectedAddress!, 7) :
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
                  <HashBasedUserAvatar UID={connectedAddress!} size={50} />
                  <Typography color={COLORS_DARK_THEME.PRIMARY_STEEL_GRAY_20}>
                    {formatAddress(connectedAddress!, 10)}
                  </Typography>
                  <CopyAndFollowComponent address={connectedAddress!} />
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
        </Box>}
      <div id='onfido-mount'></div>
    </AppBar>
  );
};

export default Header
