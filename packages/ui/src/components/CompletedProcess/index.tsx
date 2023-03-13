import { Box, Typography } from "@mui/material"

const CompletedProcess = ({ text }: { text: string }) => {

    return (
        <Box>
            <Typography variant="h5">
                {text}
            </Typography>
        </Box>
    )
}

export default CompletedProcess
