import { Box, Button, Collapse, Fade } from "@mui/material"
import axios from "api/axios"
import ConvertedAmount from "components/ConvertedAmount"
import CreationField from "components/FormField"
import { FormField, CurrencyToInternalWalletMapper, CurrencyToWalletAliasMapper } from "components/FormField/types"
import { getFieldisValid, isValidSubmit, isValidTiersTotal } from "components/FormField/validation"
import TotalInUsd from "components/TotalInUsd"
import { styles } from "containers/Welcome/styles"
import { DocumentData, Timestamp } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "store"
import { updateModalState } from "store/modals"
import { updateNftTiersState } from "store/nftTiers"
import { PrivateSaleFields, updateUser } from "store/user"
import { APP_DETAILS, CHAIN_DETAILS } from "utils/constants"
import { authenticateWithFirebase, saveData } from "utils/firebase"
import { getAvailableNftQuantities } from "utils/helpers"
import { getFlowStatus } from "utils/onfido"
import { deleteEverythingButNonce } from '../../utils/firebase';
import { TailSpin as TailSpinLoader } from 'svg-loaders-react'

const SaleForm = () => {

    const dispatch = useDispatch()
    const userState = useSelector((state: RootState) => state.userState)
    const tierData = useSelector((state: RootState) => state.nftTiersState)
    const { chosenCurrency } = useSelector((state: RootState) => state.ratesState)
    const { isValid: validTiers } = getFieldisValid(FormField.nftTiers, userState.registrationState?.nftTiers!, { nonSubmit: false, tierData: tierData })
    const { isValid: validTiersTotal } = isValidTiersTotal(userState.registrationState?.nftTiers!)
    const [emailFromDb, setEmailFromDb] = useState<string>('')
    const [firstNameFromDb, setFirstNameFromDb] = useState<string>('')
    const [lastNameFromDb, setLastNameFromDb] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(true)

    const handleSubmit = async () => {
        const collectedData: PrivateSaleFields = {
            ...userState.registrationState!,
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

            const dataForUserDownload = {
                connectedAddress: collectedData.connectedAddress,
                paymentFrom: collectedData.externalWallet,
                paymentTo: collectedData.internalWallet,
                firstName: collectedData.firstName,
                lastName: collectedData.lastName,
                amountToSpend: collectedData.amountToSpend,
                email: collectedData.email,
                nftCount: collectedData.nftCount,
                nftTiers: collectedData.nftTiers,
                tocAgreed: collectedData.tocAgreed
            }

            await saveData(userState.registrationState?.connectedAddress!, dataForSaving)

            await axios.post(
                CHAIN_DETAILS.NFT_DEDUCT_URL,
                {
                    nftTiers: collectedData.nftTiers,
                    nftCount: collectedData.nftCount
                }
            )

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

            if (((error as any).request?.responseURL as string)?.endsWith("deduct-nfts")) {
                await deleteEverythingButNonce(userState.registrationState?.connectedAddress!);
            }
        }
    }

    useEffect(() => {
        (async () => {
            const { quantities, limit } = await getAvailableNftQuantities()
            const { email: emailFromDb, firstName: firstNameFromDb, lastName: lastNameFromDb } = await getFlowStatus(userState.address!)
            dispatch(updateNftTiersState({ ...quantities, limit: limit }))
            dispatch(updateUser({
                registrationState: {
                    ...userState.registrationState!,
                    email: emailFromDb,
                    firstName: firstNameFromDb,
                    lastName: lastNameFromDb
                }
            }))
            setEmailFromDb(emailFromDb)
            setFirstNameFromDb(firstNameFromDb)
            setLastNameFromDb(lastNameFromDb)
            setLoading(false)
        })()
        //eslint-disable-next-line
    }, [])

    useEffect(() => {
        if (chosenCurrency) {
            dispatch(updateUser({
                registrationState: {
                    ...userState.registrationState!,
                    internalWallet: CurrencyToInternalWalletMapper[chosenCurrency]
                }
            }))
            return
        }
        dispatch(updateUser({
            registrationState: {
                ...userState.registrationState!,
                internalWallet: ''
            }
        }))
        //eslint-disable-next-line
    }, [chosenCurrency])

    return (loading ? <TailSpinLoader /> :
        <Fade in={!loading} timeout={APP_DETAILS.fadeTimeOut}>
            <Box gap={4} sx={styles.formHolder}>
                <CreationField
                    type={FormField.connectedAddress}
                    text={'Connected Address'}
                    isDisabled={true}
                />
                <CreationField
                    isDisabled={!!firstNameFromDb}
                    type={FormField.firstName}
                    text={'First Name'}
                    placeholder={'John'}
                />
                <CreationField
                    isDisabled={!!lastNameFromDb}
                    type={FormField.lastName}
                    text={'Last Name'}
                    placeholder={'Doe'}
                />
                <CreationField
                    isDisabled={!!emailFromDb}
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
                </Collapse>
                <Collapse
                    sx={{ width: '100%' }}
                    timeout={'auto'}
                    in={!!chosenCurrency && validTiersTotal}
                >
                    <Box gap={3} sx={{ display: 'flex', flexDirection: 'column' }}>
                        <CreationField
                            type={FormField.externalWallet}
                            text={'External Wallet Address'}
                            placeholder={`The ${CurrencyToWalletAliasMapper[chosenCurrency!]?.toUpperCase()} network address you will be paying from`}
                        />
                        <CreationField
                            type={FormField.internalWallet}
                            text={'Internal Wallet Address'}
                            placeholder={'The address to pay to. Depends on the selected currency'}
                            isDisabled={true}
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
        </Fade>
    )
}

export default SaleForm
