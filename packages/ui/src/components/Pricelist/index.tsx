import { Box, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { getAvailableNftQuantities } from "utils/helpers"
import { TailSpin as TailSpinLoader } from 'svg-loaders-react'
import { TIER_PRICES, updateNftTiersState } from "store/nftTiers"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "store"

const Pricelist = () => {

    const dispatch = useDispatch()
    const [loading, setLoading] = useState<boolean>(true)
    const available = useSelector((state: RootState) => state.nftTiersState)

    useEffect(() => {
        (async () => {
            const { quantities, limit } = await getAvailableNftQuantities()
            dispatch(updateNftTiersState({ ...quantities, limit: limit }))
            setTimeout(() => setLoading(false), 300)
        })()
        //eslint-disable-next-line
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
