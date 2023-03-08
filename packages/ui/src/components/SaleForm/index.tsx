import { Box, Button, Collapse } from "@mui/material"
import ConvertedAmount from "components/ConvertedAmount"
import CreationField from "components/FormField"
import { FormField } from "components/FormField/types"
import { getFieldisValid, isValidSubmit } from "components/FormField/validation"
import TotalInUsd from "components/TotalInUsd"
import { styles } from "containers/Welcome/styles"
import { DocumentData, Timestamp } from "firebase/firestore"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "store"
import { updateModalState } from "store/modals"
import { updateNftTiersState } from "store/nftTiers"
import { PrivateSaleFields, updateUser } from "store/user"
import { CHAIN_DETAILS } from "utils/constants"
import { authenticateWithFirebase, saveData } from "utils/firebase"
import { getAvailableNftQuantities } from "utils/helpers"

const SaleForm = () => {

    const dispatch = useDispatch()
    const userState = useSelector((state: RootState) => state.userState)
    const tierData = useSelector((state: RootState) => state.nftTiersState)
    const { chosenCurrency } = useSelector((state: RootState) => state.ratesState)
    const { isValid: validTiers } = getFieldisValid(FormField.nftTiers, userState.registrationState?.nftTiers!, { nonSubmit: false, tierData: tierData })

    const handleSubmit = async () => {
        const collectedData: PrivateSaleFields = {
            ...userState.registrationState!,
            amountToSpend: userState.registrationState?.amountToSpend!,
            nftCount: Object.values(userState.registrationState?.nftTiers!).reduce((acc, { qty }) => acc + qty, 0).toString()
        }
        try {
            dispatch(updateModalState({
                loading: true,
                loadingType: true,
            }))
            const { success } = await authenticateWithFirebase(
                collectedData.connectedAddress,
                CHAIN_DETAILS.FIREBASE.COLLECTION,
                userState.connectedLedger!
            )
            if (!success) {
                throw new Error('Failed to authenticate with Firebase')
            }

            const dataForSaving: DocumentData = {
                ...collectedData,
                formSubmittedAt: Timestamp.now().toDate(),
                processCompleted: true
            }

            await saveData(userState.registrationState?.connectedAddress!, dataForSaving)

            const dataForUserDownload = {
                connectedAddress: collectedData.connectedAddress,
                paymentFrom: collectedData.externalWallet,
                paymentTo: 'TODO: address to pay to',
                firstName: collectedData.firstName,
                lastName: collectedData.lastName,
                amountToSpend: collectedData.amountToSpend,
                email: collectedData.email,
                nftCount: collectedData.nftCount,
                nftTiers: collectedData.nftTiers,
                tocAgreed: collectedData.tocAgreed
            }

            dispatch(updateModalState({
                loading: false,
                loadingType: false,
                success: true,
                message: "Order submitted",
                data: dataForUserDownload
            }))

            dispatch(updateUser({
                registrationState: {
                    ...userState.registrationState!,
                    processCompleted: true
                }
            }))

        } catch (error) {
            console.error((error as Error).message)
            dispatch(updateModalState({
                loading: false,
                loadingType: false,
                failure: true,
                message: 'Something went wrong'
            }))
        }
    }

    useEffect(() => {
        (async () => {
            const { quantities, limit } = await getAvailableNftQuantities()
            dispatch(updateNftTiersState({ ...quantities, limit: limit }))
        })()
    }, [])

    return (
        <Box gap={4} sx={styles.formHolder}>
            <CreationField
                type={FormField.connectedAddress}
                text={'Connected Address'}
                isDisabled={true}
            />
            <CreationField
                type={FormField.firstName}
                text={'First Name'}
                placeholder={'John'}
            />
            <CreationField
                type={FormField.lastName}
                text={'Last Name'}
                placeholder={'Doe'}
            />
            <CreationField
                type={FormField.email}
                text={'Email'}
                placeholder={'john@doe.com'}
            />
            <CreationField
                type={FormField.nftTiers}
                text={'NFT Count'}
            />
            <Collapse
                sx={{ width: '100%' }}
                timeout={'auto'}
                in={validTiers}
            >
                <TotalInUsd />
                <ConvertedAmount />
                <Box gap={3} sx={{ display: 'flex', flexDirection: 'column' }}>
                    <CreationField
                        type={FormField.externalWallet}
                        text={'External Wallet Address'}
                        placeholder={'The address you will be paying from'}
                    />
                    <CreationField
                        type={FormField.tocAgreed}
                        text={'Terms & Conditions'}
                    />
                </Box>
            </Collapse>
            <Button
                disabled={!isValidSubmit(chosenCurrency, userState.registrationState, tierData)}
                variant="contained"
                onClick={handleSubmit}
                sx={styles.submitBtn}
            >
                Submit
            </Button>
        </Box>
    )
}

export default SaleForm
