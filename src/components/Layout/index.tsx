import { Box } from '@mui/material'
import Footer from './Footer'
import Header from './Header'

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Box style={{ height: '100vh', width: '100vw', display: 'grid' }}>
      <Header />
      <Box sx={{ overflow: 'auto', padding: '0 1rem' }} flexGrow={1}>
        {children}
      </Box>
      <Footer />
    </Box>
  )
}

export default Layout
