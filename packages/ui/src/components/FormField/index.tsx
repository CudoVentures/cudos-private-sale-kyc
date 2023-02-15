import React, { Fragment, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Box, Input, InputAdornment, Tooltip, Typography } from '@mui/material'

import { styles, validationStyles } from './styles'
import { RootState } from 'store';
import { FormField } from './types';
import { getFieldisValid } from './validation';
import { updateUser } from 'store/user';
import { COLORS_DARK_THEME } from 'theme/colors';
import { ReactComponent as InfoIcon } from 'assets/vectors/info-icon.svg'

enum NftTier {
    Opal = 'Opal',
    Ruby = 'Ruby',
    Emerald = 'Emerald',
    Diamond = 'Diamond',
    BlueDiamond = 'Blue Diamond'
}

const tiers = Array.from(Object.values(NftTier))

export const TIER_PRICES = {
    [NftTier.Opal]: {
        Private: 127.5,
        Public: 150
    },
    [NftTier.Ruby]: {
        Private: 255,
        Public: 300
    },
    [NftTier.Emerald]: {
        Private: 850,
        Public: 1000
    },
    [NftTier.Diamond]: {
        Private: 2550,
        Public: 3000
    },
    [NftTier.BlueDiamond]: {
        Private: 4250,
        Public: 5000
    }
}

const StartAdornment = ({ text }: { text: string }) => {
    return (
        <InputAdornment position="start">
            <Typography
                sx={{ marginRight: '-5px' }}
                fontWeight={600}
                variant='subtitle2'
                color={COLORS_DARK_THEME.PRIMARY_STEEL_GRAY_50}>
                {text}
            </Typography>
        </InputAdornment>
    )
}
const getStartAdornment = (type: FormField): JSX.Element => {
    switch (type) {
        case FormField.amountToSpend:
            return <StartAdornment text='USD' />
        default:
            return <div></div>
    }
}

const CreationField = ({
    type,
    text,
    placeholder,
    isDisabled,
}: {
    type: FormField,
    text: string
    placeholder?: string,
    isDisabled?: boolean,
}) => {

    const dispatch = useDispatch()
    const [isValid, setIsValid] = useState<boolean>(true)
    const [tooltip, setTooltip] = useState<string>('')
    const user = useSelector((state: RootState) => state.userState)

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (['e', 'E', '+', '-', ',', '.'].includes(event.key)) {
            event!.preventDefault()
        }
    }

    const handleTierChange = (index: number, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {

        const newTiers = { ...user.registrationState?.nftTiers! }

        const tier = event.target.name
        const quantity = event.target.value
        const price = TIER_PRICES[tier].Private
        newTiers[tier] = {
            qty: Number(quantity),
            cost: price
        }
        dispatch(updateUser({
            registrationState: {
                ...user.registrationState!,
                nftTiers: newTiers
            }
        }))
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {

        let value: string | number = e.target.value as string

        const { isValid, tooltip } = getFieldisValid(type, value)
        setIsValid(isValid)
        setTooltip(tooltip)
        dispatch(updateUser({
            registrationState: {
                ...user.registrationState!,
                [type]: value
            }
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
                {type !== FormField.nftCount ?
                    <Tooltip
                        placement='bottom-start'
                        PopperProps={validationStyles.tooltipPopper}
                        componentsProps={validationStyles.tooltipProps}
                        open={!isValid}
                        title={tooltip}
                    >
                        <Input
                            disabled={isDisabled}
                            startAdornment={getStartAdornment(type)}
                            placeholder={placeholder ? placeholder : undefined}
                            disableUnderline
                            type='text'
                            sx={isValid ? styles.input : validationStyles.invalidInput}
                            value={user.registrationState![type]}
                            onChange={handleChange}
                        />
                    </Tooltip> :
                    <Fragment>
                        <Box sx={styles.tierTitle}>
                            <Typography fontWeight={600} marginTop={-3.5}>Choose tiers of interest</Typography>
                            <Tooltip placement='right' followCursor
                                PopperProps={validationStyles.tierTooltipPopper}
                                componentsProps={validationStyles.tierTooltipProps}
                                title={
                                    <Box
                                        gap={2} sx={{ display: "flex", flexDirection: 'column' }}
                                    >
                                        {Object.keys(TIER_PRICES).map((key, idx) => {
                                            return (
                                                <Box key={idx}>
                                                    <Typography color={'text.primary'} fontWeight={900}>
                                                        {key}
                                                    </Typography>

                                                    <Typography fontWeight={900}>
                                                        {`Private sale price: $${TIER_PRICES[key].Private.toLocaleString()}`}
                                                    </Typography>
                                                    <Typography fontSize={14}>
                                                        {`Public sale price: $${TIER_PRICES[key].Public.toLocaleString()}`}
                                                    </Typography>
                                                </Box>
                                            )
                                        })}
                                    </Box>
                                }>
                                <Box>
                                    <InfoIcon style={{ marginLeft: '10px', cursor: 'pointer' }} />
                                </Box>
                            </Tooltip>
                        </Box>
                        {tiers.map((tier, index) => (
                            <Box key={index} gap={3} display='flex'>
                                <Input
                                    disabled
                                    disableUnderline
                                    type='text'
                                    sx={styles.tierInput}
                                    value={tier}
                                />
                                <Input
                                    disableUnderline
                                    type='number'
                                    sx={styles.tierInput}
                                    value={user.registrationState?.nftTiers[tier]?.qty || ''}
                                    name={tier}
                                    onKeyDown={handleKeyDown}
                                    onPaste={event => { event.preventDefault() }}
                                    onChange={(e) => handleTierChange(index, e)}
                                />
                            </Box>
                        ))}
                    </Fragment>}
            </Fragment>
        </Box>
    )
}

export default CreationField
