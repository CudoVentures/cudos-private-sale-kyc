import { Box, Link, Tooltip } from "@mui/material"
import { useState } from "react"
import { EXPLORER_ADDRESS_DETAILS } from "api/endpoints"
import copy from "copy-to-clipboard"
import LinkIcon from 'assets/vectors/link-icon.svg'
import CopyIcon from 'assets/vectors/copy-icon.svg'
import { useSelector } from "react-redux"
import { RootState } from "store"
import { themeStyles } from "./Layout/styles"
import { COLORS_DARK_THEME } from "theme/colors"

export const CopyAndFollowComponent = ({ address }: { address: string }): JSX.Element => {

    const { connectedLedger } = useSelector((state: RootState) => state.userState)
    const [copied, setCopied] = useState<boolean>(false)

    const handleCopy = (value: string) => {
        copy(value)
        setCopied(true)

        setTimeout(() => {
            setCopied(false)
        }, 3000)
    }

    return (
        <Box gap={1} style={themeStyles.centerFlexLinear}>
            <Box sx={themeStyles.iconHolder}>
                <Tooltip
                    title={copied ? 'Copied' : 'Copy to clipboard'}
                >
                    <Box sx={{ cursor: 'pointer' }} onClick={() => handleCopy(address)}>
                        <img
                            style={{ width: '24px', height: '24px', color: COLORS_DARK_THEME.PRIMARY_BLUE }}
                            src={CopyIcon}
                            alt="Copy"
                        />
                    </Box>
                </Tooltip>
            </Box>
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
