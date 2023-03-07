import { SUPPORTED_WALLET } from "cudosjs"
import { connectCosmostationLedger } from "ledgers/CosmostationLedger"
import { connectKeplrLedger } from "ledgers/KeplrLedger"
import { initialRegistrationState, userState } from "store/user"

import { CHAIN_DETAILS, LEDGERS } from "./constants"
import { authenticateWithFirebase } from "./firebase"
import { getConnectedUserAddressAndName } from "./helpers"
import { getFlowStatus } from "./onfido"

export const connectUser = async (chosenNetwork: string, ledgerType: SUPPORTED_WALLET): Promise<userState> => {

    const { address, accountName } = await getConnectedUserAddressAndName(chosenNetwork, ledgerType)
    if (!address) {
        throw new Error(`Failed to log in with ${ledgerType}`)
    }
    const { success } = await authenticateWithFirebase(
        address,
        CHAIN_DETAILS.FIREBASE.COLLECTION,
        ledgerType
    )
    if (!success) {
        throw new Error('Failed to authenticate with Firebase')
    }
    const { applicandId, workflowId, kycToken, kycStatus } = await getFlowStatus(address)
    const connectedUser: userState = {
        address: address,
        accountName: accountName,
        connectedLedger: ledgerType,
        chosenNetwork: chosenNetwork,
        registrationState: {
            ...initialRegistrationState,
            connectedAddress: address,
            kycApplicantId: applicandId,
            kycWorkflowRunId: workflowId,
            kycToken: kycToken,
            kycStatus: kycStatus
        }
    }

    return connectedUser
}

export const connectLedgerByType = async (chosenNetwork: string, ledgerType: string) => {

    if (ledgerType === LEDGERS.KEPLR) {
        return connectKeplrLedger(chosenNetwork)
    }

    if (ledgerType === LEDGERS.COSMOSTATION) {
        return connectCosmostationLedger(chosenNetwork)
    }

    return { address: '', accountName: '' }
}
