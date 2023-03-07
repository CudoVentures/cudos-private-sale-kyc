import { Box, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { getAvailableNftQuantities } from "utils/helpers"
import { TailSpin as TailSpinLoader } from 'svg-loaders-react'

export enum NftTier {
    Opal = 'Opal',
    Ruby = 'Ruby',
    Emerald = 'Emerald',
    Diamond = 'Diamond',
    BlueDiamond = 'Blue Diamond'
}

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

export type NftQuantities = {
    [key in NftTier]: number
}

const Pricelist = () => {

    const [loading, setLoading] = useState<boolean>(true)
    const [available, setAvailable] = useState<NftQuantities>({
        [NftTier.Opal]: 0,
        [NftTier.Ruby]: 0,
        [NftTier.Emerald]: 0,
        [NftTier.Diamond]: 0,
        [NftTier.BlueDiamond]: 0
    })

    useEffect(() => {
        (async () => {
            const quantities = await getAvailableNftQuantities()
            setAvailable(quantities)
            setTimeout(() => setLoading(false), 300)
        })()
    }, [])

    return (
        <Box
            gap={2} sx={{ display: "flex", flexDirection: 'column', width: '100%' }}
        >
            {Object.keys(TIER_PRICES).map((key, idx) => {
                return (
                    <Box key={idx}>
                        <Typography color={'text.primary'} fontSize={18} fontWeight={900}>
                            {key}
                        </Typography>
                        <Box display={'flex'} justifyContent={'space-between'}>
                            <Typography color={'text.secondary'} fontWeight={400}>
                                {`Available:`}
                            </Typography>
                            {loading ? <TailSpinLoader style={{ height: '20px' }} /> :
                                <Typography color={'text.secondary'} fontWeight={400}>
                                    {`${available[key] ? `${available[key]} pcs` : 'SOLD OUT'}`}
                                </Typography>}
                        </Box>
                        <Box display={'flex'} justifyContent={'space-between'}>
                            <Typography color={'text.secondary'} fontWeight={900}>
                                {`Private sale price:`}
                            </Typography>
                            <Typography color={'text.secondary'} fontWeight={900}>
                                {`$${TIER_PRICES[key].Private.toLocaleString()}`}
                            </Typography>
                        </Box>
                        <Box display={'flex'} justifyContent={'space-between'}>
                            <Typography color={'text.secondary'} fontSize={14}>
                                {`Public sale price:`}
                            </Typography>
                            <Typography color={'text.secondary'} fontSize={14}>
                                {`$${TIER_PRICES[key].Public.toLocaleString()}`}
                            </Typography>
                        </Box>
                    </Box>
                )
            })}
        </Box>
    )
}

export default Pricelist
