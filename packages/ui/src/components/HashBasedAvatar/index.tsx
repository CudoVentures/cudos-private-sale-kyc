import { Box } from "@mui/material"
import { COLORS_DARK_THEME } from "theme/colors"
import SVG from 'react-inlinesvg'
import { JdenticonConfig, toSvg } from 'jdenticon'
import { helperStyles } from "components/Layout/styles"

export const JD_CONFIG: JdenticonConfig = {
    hues: [204],
    lightness: {
        color: [0.28, 0.59],
        grayscale: [0.26, 0.90]
    },
    saturation: {
        color: 1.00,
        grayscale: 0.42
    },
    backColor: "#0000"
}

export const HashBasedUserAvatar = ({
    UID,
    size,
}: {
    UID: string,
    size: number,
}): JSX.Element => {

    return (
        <Box sx={{
            ...helperStyles.imgHolder,
            bgcolor: COLORS_DARK_THEME.DARK_BACKGROUND,
            padding: `${size / 5}px`
        }}
        >
            <SVG
                title={'User avatar'}
                src={toSvg(UID, size, JD_CONFIG)}
            />
        </Box>
    )
}