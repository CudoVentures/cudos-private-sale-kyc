import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "store"
import { updateUser } from "store/user"
import { Box, Typography, Tooltip, Divider } from "@mui/material"
import { validationStyles } from "components/FormField/styles"
import { getFieldisValid, getTiersTotalSum } from "components/FormField/validation"
import { COLORS_DARK_THEME } from "theme/colors"
import { FormField } from "components/FormField/types"
import { ReactComponent as InfoIcon } from 'assets/vectors/info-icon.svg'

const AmountDue = () => {

    const dispatch = useDispatch()
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
        dispatch(updateUser({
            registrationState: {
                ...userState.registrationState!,
                [FormField.amountToSpend]: amount.toLocaleString()
            }
        }))
        //eslint-disable-next-line
    }, [userState.registrationState?.nftTiers])

    return (
        <Tooltip
            placement='bottom-start'
            PopperProps={validationStyles.tooltipPopper}
            componentsProps={validationStyles.tooltipProps}
            open={isValidTiers && !isValidTotal}
            title={tooltip}
        >
            <Box
                display={'flex'}
                visibility={isValidTiers ? 'visible' : 'hidden'}
                width={'100%'} flexDirection={'row'}
                justifyContent={'space-between'}
            >
                <Typography fontWeight={900}>Amount to be paid</Typography>
                <Tooltip placement='right-end' followCursor
                    PopperProps={validationStyles.tierTooltipPopper}
                    componentsProps={validationStyles.tierTooltipProps}
                    title={
                        <Box
                            gap={2} sx={{ display: "flex", flexDirection: 'column' }}
                        >
                            <Typography color={'text.primary'} fontWeight={900}>
                                {`Your selection`}
                            </Typography>
                            <Divider />
                            {Array.from(Object.entries(userState.registrationState?.nftTiers!)).map(([name, props], idx) => {
                                return props.qty <= 0 ? null : (
                                    <Box gap={2} key={idx} display='flex' justifyContent={'space-between'} >
                                        <Typography color={'text.primary'} fontWeight={900}>
                                            {name}
                                        </Typography>
                                        <Typography fontWeight={900}>
                                            {`${props.qty} x ${props.cost}`}
                                        </Typography>
                                    </Box>
                                )
                            })}
                            <Typography alignSelf={'flex-end'} color={'text.primary'} fontWeight={900}>
                                {`Total`}
                            </Typography>
                            <Divider />
                            <Typography alignSelf={'flex-end'} fontWeight={900}>
                                ${totalSum.toLocaleString()}
                            </Typography>
                        </Box>
                    }>
                    <Box sx={{ cursor: 'pointer' }} display={'flex'}>
                        <Typography color={COLORS_DARK_THEME.PRIMARY_BLUE} fontWeight={900}>${totalSum.toLocaleString()}</Typography>
                        <InfoIcon style={{ marginLeft: '10px' }} />
                    </Box>
                </Tooltip>
            </Box>
        </Tooltip>
    )
}

export default AmountDue
