import { useEffect, useState } from 'react';
import { Box, Button, Collapse, Typography, Paper, Divider, AppBar, Tooltip } from '@mui/material';
import { ClickAwayListener } from '@mui/base';
import { useDispatch, useSelector } from 'react-redux'
import * as Onfido from 'onfido-sdk-ui'
import axios from 'axios';

import { ReactComponent as ArrowDown } from 'assets/vectors/arrow-down.svg'
import { ReactComponent as WalletIcon } from 'assets/vectors/wallet-icon.svg'
import { ReactComponent as AuraPoolLogo } from 'assets/vectors/aura-pool-logo.svg'
import CachedIcon from '@mui/icons-material/Cached';
import Dialog from '../Dialog';

import { headerStyles } from './styles';
import { formatAddress } from 'utils/helpers';
import { useLocation, useNavigate } from 'react-router-dom';
import { CopyAndFollowComponent } from 'components/helpers';
import { HashBasedUserAvatar } from 'components/HashBasedAvatar';
import { RootState } from 'store';
import { updateModalState, initialState as initialModalState } from 'store/modals';
import { initialState as initialRatesState } from 'store/rates';
import { initialRegistrationState, initialState, updateUser, userState } from 'store/user';
import { COLORS_DARK_THEME } from 'theme/colors';
import { updateRates } from 'store/rates';
import { deleteData, saveData } from 'utils/firebase';
import { CHAIN_DETAILS } from 'utils/constants';
import { DocumentData, Timestamp } from 'firebase/firestore';
import { getFlowStatus, kycStatus, kycStatusMapper } from 'utils/onfido';

const Header = () => {
  const location = useLocation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { address: connectedAddress, registrationState } = useSelector((state: RootState) => state.userState)
  const userState = useSelector((state: RootState) => state.userState)
  const { failure: modalFailure, success: modalSuccess } = useSelector((state: RootState) => state.modalState)
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [openMenu, setOpenMenu] = useState<boolean>(false)
  const [onfidoModalOpen, setOnfidoModalOpen] = useState<boolean>(false)

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

  const runOnfido = async (user: string, data: DocumentData) => {
    await saveData(user, data)
    setOnfidoModalOpen(true)
    const onfido = Onfido.init({
      token: data.kycToken,
      useModal: true,
      isModalOpen: true,
      shouldCloseOnOverlayClick: false,
      region: 'US',
      steps: ['welcome', 'document'],
      workflowRunId: data.kycWorkflowRunId,
      onModalRequestClose: function () {
        onfido.setOptions({ isModalOpen: false })
        dispatch(updateModalState({
          failure: true,
          message: 'KYC not completed'
        }))
        saveData(
          connectedAddress!,
          { kycStatus: kycStatus.submissionUserTerminated }
        )
        onfido.tearDown()
        setOnfidoModalOpen(false)
      },
      onError: function (error) {
        console.error(error.message)
        dispatch(updateModalState({
          failure: true,
          message: 'KYC not completed'
        }))
        saveData(
          connectedAddress!,
          {
            kycStatus: kycStatus.submissionErrorTerminated,
            kycError: error.message
          }
        )
        onfido.tearDown()
        setOnfidoModalOpen(false)
      },
      onUserExit: function () {
        dispatch(updateModalState({
          failure: true,
          message: 'KYC not completed'
        }))
        saveData(
          connectedAddress!,
          { kycStatus: kycStatus.submissionUserTerminated }
        )
        onfido.tearDown()
        setOnfidoModalOpen(false)
      },

      onComplete: function (data) {
        onfido.setOptions({ isModalOpen: false })
        dispatch(updateModalState({
          success: true,
          message: "Entry submitted"
        }))
        saveData(
          connectedAddress!,
          { kycStatus: kycStatus.submissionCompleted }
        )

        onfido.tearDown()
        setOnfidoModalOpen(false)
      }
    })
  }

  const restartOnfido = async () => {
    dispatch(updateModalState({
      loading: true,
      loadingType: true,
    }))
    await deleteData(
      connectedAddress!,
      [
        'kycStatus',
        'kycToken',
        'kycApplicantId',
        'kycWorkflowRunId',
        'kycError',
        'createdAt',
        'resumedAt'
      ]
    )
    const updatedUser = {
      ...userState,
      registrationState: {
        ...initialRegistrationState
      }
    }
    dispatch(updateUser(updatedUser as userState))
    dispatch(updateModalState({
      loading: false,
      loadingType: false,
    }))
  }

  const resumeOnfido = async () => {
    if (!registrationState?.kycApplicantId || !registrationState.kycToken || !registrationState.kycWorkflowRunId) {
      await startOnfido()
      return
    }
    const resumedData: DocumentData = {
      kycStatus: kycStatus.submissionResumed,
      kycError: '',
      kycToken: registrationState.kycToken,
      kycApplicantId: registrationState?.kycApplicantId,
      kycWorkflowRunId: registrationState.kycWorkflowRunId,
      resumedAt: Timestamp.now().toDate()
    }
    await runOnfido(connectedAddress!, resumedData)
  }

  const startOnfido = async () => {
    dispatch(updateModalState({
      loading: true,
      loadingType: true,
    }))
    const kycRegisterRes = await axios.post(
      CHAIN_DETAILS.KYC_REGISTER_APPLICANT_URL,
      { firstName: 'default', lastName: 'default' }
    )
    const kycWorkflowRunRes = await axios.post(
      CHAIN_DETAILS.KYC_CREATE_WORKFLOW_RUN_URL,
      {
        applicantId: kycRegisterRes.data.applicantId,
        address: connectedAddress,
        amount: 1275
      }
    )
    const initialData: DocumentData = {
      kycStatus: kycStatus.submissionStarted,
      kycError: '',
      kycToken: kycRegisterRes.data.token as string,
      kycApplicantId: kycRegisterRes.data.applicantId as string,
      kycWorkflowRunId: kycWorkflowRunRes.data.id as string,
      createdAt: Timestamp.now().toDate()
    }
    dispatch(updateModalState({
      loading: false,
      loadingType: false,
    }))
    await runOnfido(connectedAddress!, initialData)
  }

  useEffect(() => {
    if (connectedAddress) {
      setIsConnected(true)
      return
    }

    setIsConnected(false)
  }, [connectedAddress])

  useEffect(() => {
    if ((onfidoModalOpen || modalFailure || modalSuccess) && connectedAddress) {
      (async () => {
        const { applicandId, workflowId, kycToken, kycStatus } = await getFlowStatus(connectedAddress)
        const updatedUser = {
          ...userState,
          registrationState: {
            ...userState.registrationState,
            kycApplicantId: applicandId,
            kycWorkflowRunId: workflowId,
            kycToken: kycToken,
            kycStatus: kycStatus as string
          }
        }
        dispatch(updateUser(updatedUser as userState))
      })()
    }
    //eslint-disable-next-line
  }, [modalFailure, modalSuccess, onfidoModalOpen])

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
      <Box
        id='rightNavContent'
        gap={2}
        sx={{ display: 'flex', alignItems: 'center', position: 'absolute', right: 0, marginRight: '4rem' }}>
        {isConnected ?
          <Box gap={2} display='flex' alignItems={'center'}>
            <Typography>
              Verification
            </Typography>
            {registrationState!.kycStatus ?
              <Typography color='text.secondary'>
                {kycStatusMapper(registrationState!.kycStatus)}
              </Typography> : null}
            {
              !registrationState!.kycStatus ?
                <Button
                  variant="outlined"
                  onClick={startOnfido}
                >
                  Start
                </Button>
                :
                <Box gap={1} display={'flex'}>
                  <Button
                    variant="outlined"
                    onClick={resumeOnfido}
                  >
                    Resume
                  </Button>
                  <Tooltip title='Restart verification process'>
                    <Button
                      variant="outlined"
                      onClick={restartOnfido}
                    >
                      <CachedIcon sx={{ width: '20px' }} />
                    </Button>
                  </Tooltip>
                </Box>
            }
          </Box> : null}
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
      </Box>
      <div id='onfido-mount'></div>
    </AppBar>
  );
};

export default Header
