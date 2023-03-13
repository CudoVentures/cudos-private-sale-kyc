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
import { authenticateWithFirebase, deleteEverythingButNonce, saveData } from 'utils/firebase';
import { CHAIN_DETAILS } from 'utils/constants';
import { DocumentData, Timestamp } from 'firebase/firestore';
import { getFlowStatus, kycStatus, kycStatusMapper, sanitizeKycStatus } from 'utils/onfido';
import { getLatestWorkflowStatusFromOnfido } from 'api/calls';

const Header = () => {
  const location = useLocation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { address: connectedAddress, registrationState } = useSelector((state: RootState) => state.userState)
  const userState = useSelector((state: RootState) => state.userState)
  const { failure: modalFailure, success: modalSuccess } = useSelector((state: RootState) => state.modalState)
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [openMenu, setOpenMenu] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
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

  const runOnfido = async (token: string, workflowRunId: string) => {
    setOnfidoModalOpen(true)
    const onfido = Onfido.init({
      token: token,
      useModal: true,
      isModalOpen: true,
      shouldCloseOnOverlayClick: false,
      region: 'US',
      steps: ['welcome', 'document'],
      workflowRunId: workflowRunId,
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

      onComplete: async function (data) {
        onfido.setOptions({ isModalOpen: false })
        dispatch(updateModalState({
          success: true,
          message: "Documents successfully submitted"
        }))
        await saveData(
          connectedAddress!,
          { kycStatus: kycStatus.submissionCompleted }
        )
        dispatch(updateUser({
          registrationState: {
            ...userState.registrationState!,
            kycStatus: kycStatus.submissionCompleted
          }
        }))

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
    const { success } = await authenticateWithFirebase(
      connectedAddress!,
      CHAIN_DETAILS.FIREBASE.COLLECTION,
      userState.connectedLedger!
    )
    if (!success) {
      throw new Error('Failed to authenticate with Firebase')
    }
    await deleteEverythingButNonce(connectedAddress!)
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
    if (!registrationState?.kycApplicantId || !registrationState.kycWorkflowRunId) {
      await startOnfido()
      return
    }
    const tokenResponse = await axios.post(
      CHAIN_DETAILS.KYC_GET_RESUME_FLOW_TOKEN_URL,
      { applicantId: registrationState?.kycApplicantId }
    )
    const resumedData: DocumentData = {
      kycStatus: kycStatus.submissionResumed,
      resumedAt: Timestamp.now().toDate()
    }
    await saveData(connectedAddress!, resumedData)
    await runOnfido(tokenResponse.data.token, registrationState.kycWorkflowRunId)
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
    const workflowId = kycWorkflowRunRes.data.id as string
    const initialData: DocumentData = {
      kycStatus: kycStatus.submissionStarted,
      kycError: '',
      kycApplicantId: kycRegisterRes.data.applicantId as string,
      kycWorkflowRunId: workflowId,
      kycStartedAt: Timestamp.now().toDate()
    }
    await saveData(connectedAddress!, initialData)
    dispatch(updateModalState({
      loading: false,
      loadingType: false,
    }))
    await runOnfido(kycRegisterRes.data.token, workflowId)
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
      <Box
        id='rightNavContent'
        gap={2}
        sx={{ display: 'flex', alignItems: 'center', position: 'absolute', right: 0, marginRight: '4rem' }}>
        {!connectedAddress || loading || registrationState?.processCompleted ? null :
          <Box gap={2} display='flex' alignItems={'center'}>
            <Typography>
              Verification
            </Typography>
            {registrationState!.kycStatus ?
              <Typography
                color={
                  registrationState!.kycStatus === kycStatus.submissionCompleted ||
                    registrationState!.kycStatus === kycStatus.submissionUserTerminated ?
                    COLORS_DARK_THEME.TESTNET_ORANGE :
                    registrationState!.kycStatus === kycStatus.verificationSuccessful ?
                      COLORS_DARK_THEME.VERIFIED_GREEN :
                      registrationState!.kycStatus === kycStatus.verificationRejected ||
                        registrationState!.kycStatus === kycStatus.submissionErrorTerminated ?
                        COLORS_DARK_THEME.REJECTED_RED :
                        'text.secondary'
                }
              >
                {kycStatusMapper(registrationState!.kycStatus)}
              </Typography> : null}
            {(registrationState!.kycStatus !== kycStatus.verificationSuccessful &&
              registrationState!.kycStatus !== kycStatus.submissionCompleted) ?
              !registrationState!.kycStatus ?
                <Button
                  variant="outlined"
                  onClick={startOnfido}
                >
                  Start
                </Button>
                :
                <Box gap={1} display={'flex'}>
                  {registrationState!.kycStatus === kycStatus.verificationRejected ? null :
                    <Button
                      variant="outlined"
                      onClick={resumeOnfido}
                    >
                      Resume
                    </Button>}
                  <Tooltip title='Restart verification process'>
                    <Button
                      variant="outlined"
                      onClick={restartOnfido}
                    >
                      <CachedIcon sx={{ width: '20px' }} />
                    </Button>
                  </Tooltip>
                </Box>
              : null}
          </Box>}
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
