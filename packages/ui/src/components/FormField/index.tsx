import React, { Fragment, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Box, Checkbox, FormControlLabel, Input, Tooltip, Typography } from '@mui/material'

import { getInvalidInputStyling, styles, validationStyles } from './styles'
import { RootState } from 'store';
import { FormField } from './types';
import { getFieldisValid } from './validation';
import { updateUser } from 'store/user';
import { COLORS_DARK_THEME } from 'theme/colors';
import { ReactComponent as InfoIcon } from 'assets/vectors/info-icon.svg'
import Pricelist from 'components/Pricelist';
import { updateModalState } from 'store/modals';
import { NftTier, TIER_PRICES } from 'store/nftTiers';

const CreationField = ({
    type,
    text,
    value,
    placeholder,
    isDisabled,
    endAdornment
}: {
    type: FormField,
    text: string
    value?: any,
    placeholder?: string,
    isDisabled?: boolean,
    endAdornment?: JSX.Element
}) => {

    const dispatch = useDispatch()
    const [isValid, setIsValid] = useState<boolean>(true)
    const [tooltip, setTooltip] = useState<string>('')
    const user = useSelector((state: RootState) => state.userState)
    const { chosenCurrency } = useSelector((state: RootState) => state.ratesState)
    const availableNfts = useSelector((state: RootState) => state.nftTiersState)

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (['e', 'E', '+', '-', ',', '.'].includes(event.key)) {
            event!.preventDefault()
        }
    }

    const handleAgreement = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(updateUser({
            registrationState: {
                ...user.registrationState!,
                [type]: e.target.checked
            }
        }))
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value: any = e.target.value
        if (type === FormField.nftTiers) {
            const newTiers = { ...user.registrationState?.nftTiers! }
            const tier = e.target.name
            const quantity = e.target.value
            const price = TIER_PRICES[tier].Private
            newTiers[tier] = {
                qty: Number(quantity),
                cost: price
            }
            value = newTiers
        }

        const { isValid, tooltip } = getFieldisValid(
            type,
            value,
            {
                nonSubmit: true,
                tierData: type === FormField.nftTiers ? availableNfts : undefined,
                chosenCurrency: type === FormField.payerWalletAddress ? chosenCurrency : undefined
            }
        )
        setIsValid(isValid)
        setTooltip(tooltip)
        dispatch(updateUser({
            registrationState: {
                ...user.registrationState!,
                [type]: value
            }
        }))
    }

    const openTOC = () => {
        dispatch(updateModalState({
            openTOC: true
        }))
    }

    return (
        <Box width='100%'>
            <Typography
                display={'flex'}
                alignItems='center'
                fontWeight={600}
            >
                {text}
            </Typography>
            <Fragment>
                <Tooltip
                    placement='bottom-start'
                    PopperProps={validationStyles.tooltipPopper}
                    componentsProps={type === FormField.internalWallet && isValid ? validationStyles.connectedTooltipProps : validationStyles.tooltipProps}
                    open={!isValid || (type === FormField.internalWallet && isValid)}
                    title={type === FormField.internalWallet && isValid ? 'The CUDOS Markets’ wallet address where you have to send your money to.' : tooltip}
                >
                    {
                        type === FormField.tocAgreed ?
                            <Box>
                                <FormControlLabel control={<Checkbox onChange={handleAgreement} size='small' />} label="I Agree" />
                                <Typography fontSize={12}>
                                    By Clicking "I Agree", you acknowledge that you have read and agree our
                                    <Typography
                                        onClick={openTOC}
                                        component={'span'}
                                        sx={{
                                            fontSize: 'inherit',
                                            cursor: 'pointer',
                                            margin: '0 5px',
                                            color: COLORS_DARK_THEME.PRIMARY_BLUE
                                        }}
                                    >
                                        Terms & Conditions
                                    </Typography>
                                    of this private sale.
                                </Typography>
                            </Box>
                            :
                            type === FormField.nftTiers ?
                                <Box>
                                    <Box sx={{ ...styles.tierTitle, justifyContent: 'space-between' }}>
                                        <Box sx={styles.tierTitle}>
                                            <Typography fontWeight={600} marginTop={-3.5}>Choose tiers of interest</Typography>
                                            <Tooltip placement='right' followCursor
                                                PopperProps={validationStyles.tierTooltipPopper}
                                                componentsProps={validationStyles.tierTooltipProps}
                                                title={<Pricelist />}>
                                                <Box>
                                                    <InfoIcon style={{ marginLeft: '10px', cursor: 'pointer' }} />
                                                </Box>
                                            </Tooltip>
                                        </Box>
                                        <Typography fontWeight={600}>Quantity</Typography>
                                    </Box>
                                    <Box gap={2} display='flex' marginTop={'10px'} flexDirection={'column'}>
                                        {Array.from(Object.values(NftTier)).map((tier, index) => (
                                            <Box key={index} gap={3} display='flex'>
                                                <Input
                                                    disabled
                                                    disableUnderline
                                                    type='text'
                                                    sx={isValid ? styles.tierInput : getInvalidInputStyling('text', index)}
                                                    value={tier}
                                                />
                                                <Input
                                                    disableUnderline
                                                    type='number'
                                                    sx={isValid ? styles.tierInput : getInvalidInputStyling('number', index)}
                                                    value={user.registrationState?.nftTiers[tier]?.qty || ''}
                                                    name={tier}
                                                    onKeyDown={handleKeyDown}
                                                    onPaste={event => { event.preventDefault() }}
                                                    onChange={handleChange}
                                                />
                                            </Box>
                                        ))}
                                    </Box>
                                </Box>
                                :
                                <Input
                                    disabled={isDisabled}
                                    placeholder={placeholder ? placeholder : undefined}
                                    endAdornment={endAdornment}
                                    disableUnderline
                                    type='text'
                                    sx={isValid ? styles.input : validationStyles.invalidInput}
                                    value={value ? value : user.registrationState![type]}
                                    onChange={handleChange}
                                />
                    }
                </Tooltip>
            </Fragment>
        </Box >
    )
}

export default CreationField
