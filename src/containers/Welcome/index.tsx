import { Box, Typography } from '@mui/material'

import Dialog from 'components/Dialog'
import { useSelector } from 'react-redux'
import { RootState } from 'store'

import { styles } from './styles'

const Welcome = () => {

  const userState = useSelector((state: RootState) => state.userState)

  return (
    <Box style={styles.contentHolder}>
      <Dialog />
      <Typography variant='h4' color="text.primary" >
        WELCOME CONTENT
      </Typography>
    </Box>
  )

}

export default Welcome
