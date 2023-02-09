import { Box, Typography } from '@mui/material'
import Dialog from 'components/Dialog'
import { styles } from './styles'

const Welcome = () => {

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
