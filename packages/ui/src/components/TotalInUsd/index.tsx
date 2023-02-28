import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { RootState } from "store"
import { Box, Typography, Tooltip } from "@mui/material"
import { validationStyles } from "components/FormField/styles"
import { getFieldisValid, getTiersTotalSum } from "components/FormField/validation"
import { COLORS_DARK_THEME } from "theme/colors"
import { FormField } from "components/FormField/types"

const TotalInUsd = () => {

    const userState = useSelector((state: RootState) => state.userState)
    const [totalSum, setTotalSum] = useState<number>(0)
    const [isValidTiers, setIsValidTiers] = useState<boolean>(true)
    const [isValidTotal, setIsValidTotal] = useState<boolean>(true)
    const [tooltip, setTooltip] = useState<string>('')

    useEffect(() => {
        let amount = getTiersTotalSum(userState.registrationState?.nftTiers!)
        const { isValid: validTiers } = getFieldisValid(FormField.nftTiers, userState.registrationState?.nftTiers!)
        const { isValid: validAmount, tooltip } = getFieldisValid(FormField.nftTiersTotal, userState.registrationState?.nftTiers!)
        setTotalSum(amount)
        setIsValidTiers(validTiers)
        setIsValidTotal(validAmount)
        setTooltip(tooltip)

        //eslint-disable-next-line
    }, [userState.registrationState?.nftTiers])

    return (
        <Tooltip
            placement='bottom-start'
            PopperProps={validationStyles.totalPopper}
            componentsProps={validationStyles.tooltipProps}
            open={isValidTiers && !isValidTotal}
            title={tooltip}
            children={
                <Box
                    marginBottom={2}
                    height={'30px'}
                    display={'flex'}
                    alignItems={'center'}
                    width={'100%'} flexDirection={'row'}
                    justifyContent={'space-between'}
                >
                    <Typography fontWeight={900}>Total in USD</Typography>
                    <Typography color={COLORS_DARK_THEME.PRIMARY_BLUE} fontWeight={900}>${totalSum.toLocaleString(undefined, { minimumFractionDigits: 2 })}</Typography>
                </Box>
            }
        />
    )
}

export default TotalInUsd
