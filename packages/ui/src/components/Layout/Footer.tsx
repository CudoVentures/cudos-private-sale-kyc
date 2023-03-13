import { Box, Grid, Typography } from '@mui/material'
import { FOOTER } from 'utils/constants'
import { footerStyles } from './styles'

const Footer = () => {
  return (
    <Box
      id='footer'
      sx={footerStyles.holder}
      gap={1}
    >
      <Box gap={3} display="flex" alignItems={'center'} >
        {FOOTER.LEFT_LINKS.map((link, idx) => (
          <Grid
            item
            key={idx}
            sx={footerStyles.leftItem}
            onClick={() => window.open(link.url, `${link.text}`)?.focus()}
          >
            {idx === 0 ? link.text :
              <Typography
                sx={footerStyles.typography}
                fontSize={"0.8rem"}
              >
                {link.text}
              </Typography>}
          </Grid>
        ))}
      </Box>
      <Box
        alignItems="center"
        display="flex"
        gap={3}
        sx={{ marginLeft: 'auto' }}
      >
        {FOOTER.RIGHT_LINKS.map((link) => (
          <Grid
            key={link.url}
            onClick={() => window.open(link.url, link.url)?.focus()}
            sx={footerStyles.rightItem}
          >
            {link.icon}
          </Grid>
        ))}
      </Box>
    </Box>
  )
}

export default Footer
