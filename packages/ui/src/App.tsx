import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { isExtensionEnabled, SUPPORTED_WALLET } from 'cudosjs'
import { ThemeProvider } from '@mui/material/styles'
import { useDispatch, useSelector } from 'react-redux'
import { CssBaseline } from '@mui/material'
import { RootState } from 'store'
import Layout from 'components/Layout'
import { Fragment, useCallback, useEffect } from 'react'
import { updateUser } from 'store/user'
import { connectUser } from 'utils/config'
import { updateModalState } from 'store/modals'
import Welcome from 'containers/Welcome'
import { LEDGERS } from 'utils/constants'
import { initialState as initialModalState } from 'store/modals'
import { initialState as initialRatesState } from 'store/rates'
import { initialState as initialUserState } from 'store/user'
import ConnectWallet from 'containers/ConnectWallet'
import { updateRates } from 'store/rates'

import theme from 'theme'
import '@fontsource/poppins'

declare let window: any;

const App = () => {
  const location = useLocation()
  const themeColor = useSelector((state: RootState) => state.settings.theme)
  const { chosenNetwork } = useSelector((state: RootState) => state.userState)
  const dispatch = useDispatch()

  const connectAccount = useCallback(async (ledgerType: SUPPORTED_WALLET) => {

    try {
      sessionStorage.clear()
      localStorage.clear()
      dispatch(updateModalState({
        ...initialModalState,
        loading: true,
        loadingType: true
      }))

      dispatch(updateUser(initialUserState))

      const connectedUser = await connectUser(chosenNetwork!, ledgerType)

      dispatch(updateUser(connectedUser))

    } catch (error) {
      console.error((error as Error).message)

    } finally {
      dispatch(updateModalState({
        loading: false,
        loadingType: false
      }))
    }
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (isExtensionEnabled(SUPPORTED_WALLET.Keplr)) {
      window.addEventListener("keplr_keystorechange",
        async () => {
          await connectAccount(LEDGERS.KEPLR)
          return
        });
    }

    if (isExtensionEnabled(SUPPORTED_WALLET.Cosmostation)) {
      window.cosmostation.cosmos.on("accountChanged",
        async () => {
          await connectAccount(LEDGERS.COSMOSTATION)
          return
        });
    }
  }, [connectAccount])

  useEffect(() => {
    dispatch(updateRates(initialRatesState))
    dispatch(updateModalState(initialModalState))

    //eslint-disable-next-line
  }, [])

  return (
    <ThemeProvider theme={theme![themeColor!]}>
      <CssBaseline />
      <Layout children={
        <Routes location={location}>
          <Fragment>
            <Route path={'/'} element={<ConnectWallet />} />
            <Route path={'welcome'} element={<Welcome />}
            />
            <Route path="*" element={<Navigate to={'/'} state={{ from: location }} />} />
          </Fragment>
        </Routes>
      } />
    </ThemeProvider>
  )
}

export default App
