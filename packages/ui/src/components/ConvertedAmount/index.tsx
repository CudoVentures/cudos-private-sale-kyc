import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "store"
import { updateUser, userState as userStateInterface } from "store/user"
import { Box, Typography, Select, MenuItem, ClickAwayListener } from "@mui/material"
import { COLORS_DARK_THEME } from "theme/colors"
import { Currencies } from "../../../../common/types"
import { updateRates } from "store/rates"
import { TailSpin as TailSpinLoader } from 'svg-loaders-react'
import { getTotalAmounts } from "utils/helpers"
import { PriceListTooltip } from "components/helpers"

const ConvertedAmount = () => {

    const dispatch = useDispatch()
    const userState = useSelector((state: RootState) => state.userState)
    const { chosenCurrency, currencyRates, fetchedAt } = useSelector((state: RootState) => state.ratesState)
    const [totalConvertedString, setTotalConvertedString] = useState<string>('')
    const [usdAmount, setUsdAmount] = useState<number>(0)
    const [loading, setLoading] = useState<boolean>(false)
    const [openSelect, setOpenSelect] = useState<boolean>(false)

    const handleSelectChange = (e: any) => {
        setLoading(true)
        dispatch(updateRates({ chosenCurrency: e.target.value }))
        const updatedUser = {
            ...userState,
            registrationState: {
                ...userState.registrationState,
                chosenCurrency: e.target.value!
            }
        }
        dispatch(updateUser(updatedUser as userStateInterface))
    }

    useEffect(() => {
        if (chosenCurrency) {
            const { usdAmount, stringifiedConvertedAmount } = getTotalAmounts(userState.registrationState?.nftTiers!, currencyRates!, chosenCurrency!)
            setTotalConvertedString(stringifiedConvertedAmount)
            setUsdAmount(usdAmount)
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
                        {chosenCurrency ? <PriceListTooltip
                            tiers={userState.registrationState?.nftTiers!}
                            fetchedAt={fetchedAt}
                            usdAmount={usdAmount}
                            rate={currencyRates![chosenCurrency]}
                            totalDue={`${totalConvertedString} ${chosenCurrency}`}
                        /> : null}
                    </Box>
                }
            />
        </Box>
    )
}

export default ConvertedAmount
