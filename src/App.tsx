import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { SUPPORTED_WALLET } from 'cudosjs'
import { ThemeProvider } from '@mui/material/styles'
import { useDispatch, useSelector } from 'react-redux'
import { CssBaseline } from '@mui/material'
import { RootState } from 'store'
import Layout from 'components/Layout'
import { useCallback, useEffect } from 'react'
import { updateUser } from 'store/user'
import { connectUser } from 'utils/config'
import { updateModalState } from 'store/modals'
import Welcome from 'containers/Welcome'
import { LEDGERS } from 'utils/constants'
import { initialState as initialModalState } from 'store/modals'
import ConnectWallet from 'containers/ConnectWallet'

import theme from 'theme'
import '@fontsource/poppins'

const App = () => {
  const location = useLocation()
  const themeColor = useSelector((state: RootState) => state.settings.theme)
  const { chosenNetwork } = useSelector((state: RootState) => state.userState)
  const dispatch = useDispatch()

  const connectAccount = useCallback(async (ledgerType: SUPPORTED_WALLET) => {

    try {
      dispatch(updateModalState({
        loading: true,
        loadingType: true
      }))

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
    window.addEventListener("keplr_keystorechange",
      async () => {
        await connectAccount(LEDGERS.KEPLR)
        return
      });

    window.cosmostation.cosmos.on("accountChanged",
      async () => {
        await connectAccount(LEDGERS.COSMOSTATION)
        return
      });

  }, [connectAccount])

  useEffect(() => {
    dispatch(updateModalState(initialModalState))

    //eslint-disable-next-line
  }, [])

  return (
    <ThemeProvider theme={theme![themeColor!]}>
      <CssBaseline />
      <Layout>
        <Routes location={location} key={location.pathname}>
          <Route path={'/'} element={<ConnectWallet />} />
          <Route path={'welcome'} element={<Welcome />}
          />
          <Route path="*" element={<Navigate to={'/'} state={{ from: location }} />} />
        </Routes>
      </Layout>
    </ThemeProvider>

  )
}

export default App
