import { COLORS_DARK_THEME } from "theme/colors";

export const styles = {
    footerLogo: {
        display: 'flex',
        color: COLORS_DARK_THEME.PRIMARY_STEEL_GRAY_50,
        alignItems: 'center',
        "&:hover": {
            color: COLORS_DARK_THEME.PRIMARY_BLUE
        }
    }
}