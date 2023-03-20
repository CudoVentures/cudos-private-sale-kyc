import { Box, Divider, Link, Tooltip, Typography } from "@mui/material"
import { useState } from "react"
import { EXPLORER_ADDRESS_DETAILS } from "api/endpoints"
import copy from "copy-to-clipboard"
import LinkIcon from 'assets/vectors/link-icon.svg'
import CopyIcon from 'assets/vectors/copy-icon.svg'
import { useSelector } from "react-redux"
import { RootState } from "store"
import { themeStyles } from "./Layout/styles"
import { COLORS_DARK_THEME } from "theme/colors"
import { validationStyles } from "./FormField/styles"
import { ReactComponent as InfoIcon } from 'assets/vectors/info-icon.svg'
import { NftTier } from "store/user"

export const PriceListTooltip = ({ tiers, usdAmount, rate, totalDue, fetchedAt }: { tiers: Record<string, NftTier>, usdAmount: number, rate: number, totalDue: string, fetchedAt?: Date }) => {

    return (
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
                {Array.from(Object.entries(tiers)).map(([name, props], idx) => {
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
                    ${usdAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })} x {rate} = {totalDue}
                </Typography>
                <Typography color={COLORS_DARK_THEME.TESTNET_ORANGE} fontSize={12} alignSelf={'flex-start'} fontWeight={400}>
                    {fetchedAt ? `Coingecko Rates as of ${fetchedAt.toLocaleString()}` : null}
                </Typography>
            </Box>}
            children={
                <Box display={"flex"}>
                    <InfoIcon style={{ cursor: 'pointer', marginLeft: '10px' }} />
                </Box>
            }
        />
    )
}

export const CopyComponent = ({ textToCopy }: { textToCopy: string }): JSX.Element => {

    const [copied, setCopied] = useState<boolean>(false)

    const handleCopy = (value: string) => {
        copy(value)
        setCopied(true)

        setTimeout(() => {
            setCopied(false)
        }, 3000)
    }

    return (
        <Box sx={themeStyles.iconHolder}>
            <Tooltip
                title={copied ? 'Copied' : 'Copy to clipboard'}
            >
                <Box sx={{ cursor: 'pointer' }} onClick={() => handleCopy(textToCopy)}>
                    <img
                        style={{ width: '24px', height: '24px', color: COLORS_DARK_THEME.PRIMARY_BLUE }}
                        src={CopyIcon}
                        alt="Copy"
                    />
                </Box>
            </Tooltip>
        </Box>
    )
}

export const CopyAndFollowComponent = ({ address }: { address: string }): JSX.Element => {

    const { connectedLedger } = useSelector((state: RootState) => state.userState)

    return (
        <Box gap={1} style={themeStyles.centerFlexLinear}>
            <CopyComponent textToCopy={address} />
            <Box sx={themeStyles.iconHolder}>
                <Tooltip title="Check address on explorer">
                    <Link
                        href={EXPLORER_ADDRESS_DETAILS(connectedLedger!, address)}
                        rel="noreferrer"
                        target='Checking address on explorer'
                    >
                        <img
                            style={{ height: '24px' }}
                            src={LinkIcon}
                            alt="Link"
                        />
                    </Link>
                </Tooltip>
            </Box>
        </Box>
    )
}
