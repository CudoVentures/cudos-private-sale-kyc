import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "store"
import { updateUser } from "store/user"
import { Box, Typography, Tooltip, Divider, Select, MenuItem } from "@mui/material"
import { validationStyles } from "components/FormField/styles"
import { getTiersTotalSum } from "components/FormField/validation"
import { COLORS_DARK_THEME } from "theme/colors"
import { Currencies, FormField } from "components/FormField/types"
import { ReactComponent as InfoIcon } from 'assets/vectors/info-icon.svg'
import { updateRates } from "store/rates"

const ConvertedAmount = () => {

    const dispatch = useDispatch()
    const userState = useSelector((state: RootState) => state.userState)
    const { chosenCurrency, currencyRates, fetchedAt } = useSelector((state: RootState) => state.ratesState)
    const [totalUsd, setTotalUsd] = useState<number>(0)
    const [totalConvertedString, setTotalConvertedString] = useState<string>('')

    const stringifyConvertedAmount = (amount: number) => {
        if (chosenCurrency === Currencies.USDC) {
            return `${amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
        }
        return `${amount.toFixed(8)}`
    }

    useEffect(() => {
        const usdAmount = getTiersTotalSum(userState.registrationState?.nftTiers!)
        const convertedAmount = usdAmount * currencyRates![chosenCurrency!]
        const stringifiedConvertedAmount = stringifyConvertedAmount(convertedAmount)
        setTotalUsd(usdAmount)
        setTotalConvertedString(stringifiedConvertedAmount)
        dispatch(updateUser({
            registrationState: {
                ...userState.registrationState!,
                [FormField.amountToSpend]: `${stringifiedConvertedAmount} ${chosenCurrency} (converted from USD ${usdAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })})`
            }
        }))
        //eslint-disable-next-line
    }, [userState.registrationState?.nftTiers, chosenCurrency])

    return (
        <Box
            marginBottom={3.5}
            alignItems={'center'}
            display={'flex'}
            width={'100%'} flexDirection={'row'}
            justifyContent={'space-between'}
        >
            <Typography fontWeight={900}>Amount to be sent</Typography>
            <Box display={'flex'} alignItems={'center'}>
                <Box gap={1} display={'flex'} alignItems={'center'}>
                    <Typography color={COLORS_DARK_THEME.PRIMARY_BLUE} fontWeight={900}>{totalConvertedString}</Typography>
                    <Select
                        renderValue={() => <Typography color={COLORS_DARK_THEME.PRIMARY_BLUE} fontWeight={900}>{chosenCurrency}</Typography>}
                        variant='standard'
                        disableUnderline
                        value={chosenCurrency}
                        onChange={(e) => dispatch(updateRates({ chosenCurrency: e.target.value as Currencies }))}
                    >
                        {Object.values(Currencies).map((value, i) => {
                            return <MenuItem value={value}>{value}</MenuItem>
                        })}
                    </Select>
                </Box>
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
                                            {`${props.qty} x $${props.cost}`}
                                        </Typography>
                                    </Box>
                                )
                            })}
                            <Typography alignSelf={'flex-end'} color={'text.primary'} fontWeight={900}>
                                {`Total`}
                            </Typography>
                            <Divider />
                            <Typography alignSelf={'flex-end'} fontWeight={900}>
                                ${totalUsd.toLocaleString(undefined, { minimumFractionDigits: 2 })} x {currencyRates![chosenCurrency!]} = {totalConvertedString} {chosenCurrency}
                            </Typography>
                            <Typography color={COLORS_DARK_THEME.TESTNET_ORANGE} fontSize={12} alignSelf={'flex-start'} fontWeight={400}>
                                {`Coingecko Rates ${fetchedAt ? `as of ${fetchedAt.toLocaleString()}` : null}`}
                            </Typography>
                        </Box>
                    }>
                    <Box sx={{ cursor: 'pointer' }}>
                        <InfoIcon style={{ marginLeft: '10px' }} />
                    </Box>
                </Tooltip>
            </Box>
        </Box>
    )
}

export default ConvertedAmount
