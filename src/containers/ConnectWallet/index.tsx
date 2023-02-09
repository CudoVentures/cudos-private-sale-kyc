import { Box, Typography } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import InfoIcon from 'assets/vectors/info-icon.svg'
import KeplrLogo from 'assets/vectors/keplr-logo.svg'
import CosmostationLogo from 'assets/vectors/cosmostation-logo.svg'
import BackgroundImage from 'assets/vectors/background.svg'
import { styles } from './styles'
import { updateModalState } from 'store/modals'
import Dialog from 'components/Dialog'
import { updateUser } from 'store/user'
import { RootState } from 'store'
import Header from 'components/Layout/Header'
import { connectUser } from 'utils/config'
import { useState } from 'react'
import { LEDGERS, MODAL_MSGS } from 'utils/constants'

const ConnectWallet = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { address, chosenNetwork } = useSelector((state: RootState) => state.userState)
  const [loading, setLoading] = useState(new Map())

  const connect = async (chosenNetwork: string, ledgerType: string) => {

    try {
      setLoading(new Map(loading.set(ledgerType, true)))
      const connectedUser = await connectUser(chosenNetwork, ledgerType)
      dispatch(updateUser(connectedUser))
      navigate('/welcome')

    } catch (error) {
      dispatch(updateModalState({
        failure: true,
        title: MODAL_MSGS.ERRORS.TITLES.LOGIN_FAIL,
        message: MODAL_MSGS.ERRORS.MESSAGES.LOGIN_FAIL
      }))
      console.error((error as Error).message)

    } finally {
      setLoading(new Map())
    }
  }

  return address ?
    (<Navigate to="/welcome" state={{ from: location }} replace />)
    :
    (
      // Inline styles required to fix building issues with imported styles for background.
      <Box style={{
        height: '100vh',
        width: '100vw',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundImage: 'url(' + BackgroundImage + ')'
      }}>
        <Dialog />
        <Header />
        <Box>
          <Box sx={styles.connectContainer}>
            <Box>
              <h1>Welcome to DApp UI Boilerplate!</h1>
            </Box>
            <Box sx={styles.subHeaderContainer}>
              <Typography variant="subtitle1" color="text.secondary">
                CUDOS DApp UI Boilerplate is a fly-start of your similar layoud DApp development
                <br />
                In order to continue you need to connect a wallet.
              </Typography>
            </Box>

            <Box gap={2} style={styles.btnsHolder}>
              <LoadingButton
                disabled={!window.keplr || loading.get(LEDGERS.COSMOSTATION)}
                loading={loading.get(LEDGERS.KEPLR)}
                variant="contained"
                color="primary"
                onClick={() => connect(chosenNetwork!, LEDGERS.KEPLR)}
                sx={styles.connectButton}
              >
                <img
                  hidden={loading.get(LEDGERS.KEPLR)}
                  style={styles.keplrLogo}
                  src={KeplrLogo}
                  alt={`${LEDGERS.KEPLR} logo`}
                />
                {`Connect ${LEDGERS.KEPLR.toUpperCase()}`}
              </LoadingButton>
              <LoadingButton
                disabled={!window.cosmostation || loading.get(LEDGERS.KEPLR)}
                loading={loading.get(LEDGERS.COSMOSTATION)}
                variant="contained"
                color="primary"
                onClick={() => connect(chosenNetwork!, LEDGERS.COSMOSTATION)}
                sx={styles.connectButton}
              >
                <img
                  hidden={loading.get(LEDGERS.COSMOSTATION)}
                  style={styles.cosmostationLogo}
                  src={CosmostationLogo}
                  alt={`${LEDGERS.COSMOSTATION} logo`}
                />
                {`Connect ${LEDGERS.COSMOSTATION.toUpperCase()}`}
              </LoadingButton>
            </Box>
            <Box sx={styles.pluginWarning} color="primary.main">
              <img style={styles.infoIcon} src={InfoIcon} alt="Info" />
              Make sure you have Keplr and/or Cosmostation plugins installed.
            </Box>
          </Box>
        </Box>
      </Box>
    )
}

export default ConnectWallet
