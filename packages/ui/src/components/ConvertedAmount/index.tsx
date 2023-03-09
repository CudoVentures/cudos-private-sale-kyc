import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "store"
import { updateUser } from "store/user"
import { Box, Typography, Tooltip, Divider, Select, MenuItem, ClickAwayListener } from "@mui/material"
import { validationStyles } from "components/FormField/styles"
import { getTiersTotalSum } from "components/FormField/validation"
import { COLORS_DARK_THEME } from "theme/colors"
import { Currencies, FormField } from "components/FormField/types"
import { ReactComponent as InfoIcon } from 'assets/vectors/info-icon.svg'
import { updateRates } from "store/rates"
import { TailSpin as TailSpinLoader } from 'svg-loaders-react'

const ConvertedAmount = () => {

    const dispatch = useDispatch()
    const userState = useSelector((state: RootState) => state.userState)
    const { chosenCurrency, currencyRates, fetchedAt } = useSelector((state: RootState) => state.ratesState)
    const [totalUsd, setTotalUsd] = useState<number>(0)
    const [totalConvertedString, setTotalConvertedString] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const [openSelect, setOpenSelect] = useState<boolean>(false)

    const handleSelectChange = (e: any) => {
        setLoading(true)
        dispatch(updateRates({ chosenCurrency: e.target.value }))
    }

    const stringifyConvertedAmount = (amount: number) => {
        if (chosenCurrency === Currencies.USDC || chosenCurrency === Currencies.USDT) {
            return `${amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
        }
        return `${amount.toFixed(8)}`
    }

    useEffect(() => {
        if (chosenCurrency) {
            const usdAmount = getTiersTotalSum(userState.registrationState?.nftTiers!)
            const convertedAmount = usdAmount / currencyRates![chosenCurrency!]
            const stringifiedConvertedAmount = stringifyConvertedAmount(convertedAmount)
            setTotalUsd(usdAmount)
            setTotalConvertedString(stringifiedConvertedAmount)
            dispatch(updateUser({
                registrationState: {
                    ...userState.registrationState!,
                    amountToSpend: `${stringifiedConvertedAmount} ${chosenCurrency} (converted from USD ${usdAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })})`
                }
            }))
            setTimeout(() => {
                setLoading(false)
                setOpenSelect(false)
            }, 300)
        }

        //eslint-disable-next-line
    }, [userState.registrationState?.nftTiers, chosenCurrency])

    return (
        <Box
            alignItems={'center'}
            display={'flex'}
            width={'100%'} flexDirection={'row'}
            justifyContent={'space-between'}
        >
            <Typography fontWeight={900}>Amount to be sent</Typography>
            <ClickAwayListener disableReactTree={true} onClickAway={() => setOpenSelect(false)}
                children={
                    <Box display={'flex'} alignItems={'center'}>
                        {loading ? <TailSpinLoader style={{ height: '20px' }} /> :
                            <Box
                                sx={{ cursor: 'pointer' }}
                                onClick={() => setOpenSelect(true)}
                                gap={1} display={'flex'} alignItems={'center'} height={'20px'}
                            >
                                {chosenCurrency ? <Typography color={COLORS_DARK_THEME.PRIMARY_BLUE} fontWeight={900}>{totalConvertedString}</Typography> : null}
                                <Select
                                    open={openSelect}
                                    native={false}
                                    renderValue={() => <Typography color={chosenCurrency ? COLORS_DARK_THEME.PRIMARY_BLUE : COLORS_DARK_THEME.TESTNET_ORANGE} fontWeight={900}>{chosenCurrency ? chosenCurrency : 'Select currency'}</Typography>}
                                    variant='standard'
                                    disableUnderline
                                    value={chosenCurrency ? chosenCurrency : 'Select value'}
                                    onChange={handleSelectChange}
                                >
                                    {Object.values(Currencies).map((value, i) => {
                                        return <MenuItem key={i} value={value}>{value}</MenuItem>
                                    })}
                                </Select>
                            </Box>
                        }
                        {chosenCurrency ?
                            <Tooltip placement='right-end' followCursor
                                PopperProps={validationStyles.tierTooltipPopper}
                                componentsProps={validationStyles.tierTooltipProps}
                                title={<Box
                                    gap={2} sx={{ display: "flex", flexDirection: 'column' }}
                                >
                                    <Typography color={'text.primary'} fontWeight={900}>
                                        {`Your selection`}
                                    </Typography>
                                    <Divider />
                                    {Array.from(Object.entries(userState.registrationState?.nftTiers!)).map(([name, props], idx) => {
                                        return props.qty <= 0 ? null : (
                                            <Box gap={2} key={idx} display='flex' justifyContent={'space-between'}>
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
                                </Box>}
                                children={
                                    <Box display={"flex"}>
                                        <InfoIcon style={{ cursor: 'pointer', marginLeft: '10px' }} />
                                    </Box>
                                }
                            /> : null}
                    </Box>
                }
            />
        </Box>
    )
}

export default ConvertedAmount
