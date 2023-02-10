import { Box, Typography } from '@mui/material'
import { useLocation } from 'react-router-dom'
import LogoHeader from 'assets/vectors/logo-header.svg'
import UserInfo from './Userinfo'
import NetworkInfo from './Networkinfo'

const Header = () => {
  const location = useLocation()

  return (
    <Box sx={{ padding: '1rem' }}>
      <Box sx={{ marginBottom: '10px', alignItems: 'center', display: 'flex', flex: '1' }}>
        <img src={LogoHeader} alt="logo" />
        <Typography fontWeight={900} marginLeft={1} marginTop={0.5} variant="h6" color="text.primary">
          | Private Sale
        </Typography>
        {location.pathname === '/' ? null : (
          <Box
            sx={{
              paddingLeft: '1rem',
              display: 'flex',
              justifyContent: 'flex-end',
              flex: '1'
            }}
          >
            <NetworkInfo />
            <UserInfo />
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default Header
