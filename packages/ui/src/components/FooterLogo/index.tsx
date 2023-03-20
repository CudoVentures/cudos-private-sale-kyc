import { Box, Divider } from "@mui/material"
import { ReactComponent as LogoFooter } from 'assets/vectors/logo-footer.svg'
import { headerStyles } from "components/Layout/styles"
import { styles } from "./styles"

export const FOOTER_LOGO = () => {
    return (
        <Box gap={3} sx={styles.footerLogo} >
            <LogoFooter />
            <Divider
                orientation='vertical'
                sx={headerStyles.divider}
            />
        </Box>
    )
}