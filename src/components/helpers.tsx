import { Box, Tooltip, Typography } from "@mui/material"
import { useState } from "react"
import { EXPLORER_ADDRESS_DETAILS } from "api/endpoints"
import copy from "copy-to-clipboard"
import LinkIcon from 'assets/vectors/link-icon.svg'
import CopyIcon from 'assets/vectors/copy-icon.svg'
import { formatAddress } from "utils/helpers"
import { styles } from "./styles"
import { useSelector } from "react-redux"
import { RootState } from "store"

export const AddressWithCopyAndFollowComponent = ({ address }: { address: string }): JSX.Element => {
    return (
        <Box style={styles.centerFlexLinear}>
            <Typography
                fontWeight={600}
                variant='subtitle1'
                color='text.primary'
            >
                {formatAddress(address, 25)}
            </Typography>
            <CopyAndFollowComponent address={address} />
        </Box>
    )
}

export const CopyAndFollowComponent = ({ address }: { address: string }): JSX.Element => {

    const { chosenNetwork } = useSelector((state: RootState) => state.userState)
    const [copied, setCopied] = useState<boolean>(false)

    const handleCopy = (value: string) => {
        copy(value)
        setCopied(true)

        setTimeout(() => {
            setCopied(false)
        }, 3000)
    }

    return (
        <Box style={styles.centerFlexLinear}>
            <Tooltip
                onClick={() => handleCopy(address)}
                title={copied ? 'Copied' : 'Copy to clipboard'}
            >
                <img
                    style={styles.icons}
                    src={CopyIcon}
                    alt="Copy"
                />
            </Tooltip>
            <Tooltip title="Check address on explorer">
                <a href={EXPLORER_ADDRESS_DETAILS(chosenNetwork!, address)} rel="noreferrer" target='_blank'>
                    <img
                        style={{ paddingTop: '5px', ...styles.icons }}
                        src={LinkIcon}
                        alt="Link"
                    />
                </a>
            </Tooltip>
        </Box>
    )
}
