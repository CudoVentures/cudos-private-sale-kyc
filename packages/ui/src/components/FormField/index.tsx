import React, { Fragment, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Box, Input, InputAdornment, MenuItem, Select, SelectChangeEvent, Tooltip, Typography } from '@mui/material'

import { styles, validationStyles } from './styles'
import { RootState } from 'store';
import { FormField } from './types';
import { getFieldisValid, sanitizeString } from './validation';
import { updateUser } from 'store/user';
import { COLORS_DARK_THEME } from 'theme/colors';

const NftTiers = Array.from({ length: 5 }, (_, i) => i + 1)

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

    const handleTierChange = (index: number, event: SelectChangeEvent<number>) => {
        const newTiers = [...user.registrationState?.nftTiers!];
        newTiers[index] = Number(event.target.value);
        dispatch(updateUser({
            registrationState: {
                ...user.registrationState!,
                nftTiers: newTiers
            }
        }))
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const isAmount =
            type === FormField.amountToSpend ||
            type === FormField.nftCount

        let value: string | number = e.target.value as string

        if (isAmount && value.length > 0) {
            const validNumber = Number(sanitizeString(value))
            if ((!validNumber || value.length > 15)) {
                e!.preventDefault()
                return
            }
            value = validNumber
        }

        const { isValid, tooltip } = getFieldisValid(type, value)
        setIsValid(isValid)
        setTooltip(tooltip)
        dispatch(updateUser({
            registrationState: {
                ...user.registrationState!,
                [type]: isAmount ? (value as number).toLocaleString() : value,
                nftTiers: type === FormField.nftCount ? Array(Number(value <= 20 ? value : 20)).fill(1) : user.registrationState?.nftTiers!
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
                </Tooltip>
                {type !== FormField.nftCount ? null :
                    Number(sanitizeString(user.registrationState?.nftCount!)) < 1 ? null :
                        <Fragment>
                            <Box display='flex'>
                                <Typography fontWeight={600} marginTop={3.5}>Choose Tiers for each NFT</Typography>
                            </Box>
                            {user.registrationState?.nftTiers!.map((tier, index) => (
                                <Select
                                    key={index}
                                    disableUnderline
                                    displayEmpty
                                    variant='standard'
                                    sx={styles.defaultDropDown}
                                    value={user.registrationState?.nftTiers[index]}
                                    onChange={(e) => handleTierChange(index, e)}
                                >
                                    {NftTiers.map((tier, idx) => {
                                        return (
                                            <MenuItem
                                                key={idx}
                                                value={tier}
                                            >
                                                {tier}
                                            </MenuItem>
                                        )
                                    })}

                                </Select>
                            ))}
                        </Fragment>
                }
            </Fragment>
        </Box>
    )
}

export default CreationField
