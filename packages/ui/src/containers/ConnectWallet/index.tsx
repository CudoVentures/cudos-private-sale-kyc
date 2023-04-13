import { Box, Button, Fade, Typography } from '@mui/material'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import BackgroundImage from 'assets/vectors/background.svg'
import { styles } from './styles'
import Dialog from 'components/Dialog'
import { RootState } from 'store'
import { useEffect, useState } from 'react'
import { APP_DETAILS } from 'utils/constants'

const ConnectWallet = () => {

  const location = useLocation()
  const navigate = useNavigate()
  const userState = useSelector((state: RootState) => state.userState)
  const [loaded, setLoaded] = useState<boolean>(false)

  useEffect(() => {
    setLoaded(true)
  }, [])

  return userState.address ? <Navigate to="welcome" state={{ from: location }} replace /> : (
    <Fade in={loaded} timeout={APP_DETAILS.fadeTimeOut}>
      <Box style={{
        height: '88vh',
        width: '99vw',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundImage: 'url(' + BackgroundImage + ')'
      }}>
        <Dialog />
        <Box>
          <Box sx={styles.connectContainer}>
            <Box>
              <h1>Welcome to CUDOS Markets Private Sale!</h1>
            </Box>
            <Box sx={styles.subHeaderContainer}>
              {userState.address ?
                <Button
                sx={{height: '48px', width: '250px'}}
                  variant="contained"
                  color="primary"
                  onClick={() => navigate('/welcome')}>Enter</Button> :
                <Typography sx={{height: '48px'}} variant="subtitle1" color="text.secondary">
                  In order to continue you need to connect a wallet.
                </Typography>
              }
            </Box>
          </Box>
        </Box>
      </Box>
    </Fade >
  )
}

export default ConnectWallet
