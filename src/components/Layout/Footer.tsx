import { Box, Grid, Typography } from '@mui/material'
import { COLORS_DARK_THEME } from 'theme/colors'
import { FOOTER } from 'utils/constants'
import { styles } from './styles'

const Footer = () => {
  return (
    <Box sx={styles.footerContainer} gap={6}>
      <Box display="flex">
        {FOOTER.LEFT_LINKS.map((link) => (
          <Grid
            item
            key={link.text}
            sx={({ palette }) => ({
              padding: `0 0.5rem`,
              '&:not(:last-child)': {
                borderRight: `1px solid ${palette.text.secondary}`
              },
              cursor: 'pointer'
            })}
            onClick={() => window.open(link.url, '_blank')?.focus()}
          >
            <Typography
              sx={{
                "&:hover": {
                  color: COLORS_DARK_THEME.PRIMARY_BLUE
                }
              }}
              color="text.secondary"
              fontSize="0.8rem"
              fontWeight={500}
            >
              {link.text}
            </Typography>
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
            onClick={() => window.open(link.url, '_blank')?.focus()}
            sx={({ palette }) => ({
              cursor: 'pointer',
              color: palette.text.secondary,
              '&:hover': {
                color: palette.primary.main
              }
            })}
          >
            {link.icon}
          </Grid>
        ))}
      </Box>
    </Box>
  )
}

export default Footer