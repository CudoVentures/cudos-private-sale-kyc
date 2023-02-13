import { SUPPORTED_WALLET } from "cudosjs"
import { connectCosmostationLedger } from "ledgers/CosmostationLedger"
import { connectKeplrLedger } from "ledgers/KeplrLedger"
import { initialRegistrationState, userState } from "store/user"

import { LEDGERS } from "./constants"
import { getConnectedUserAddressAndName } from "./helpers"

export const connectUser = async (chosenNetwork: string, ledgerType: SUPPORTED_WALLET): Promise<userState> => {

    const { address, accountName } = await getConnectedUserAddressAndName(chosenNetwork, ledgerType)
    const connectedUser: userState = {
        address: address,
        accountName: accountName,
        connectedLedger: ledgerType,
        chosenNetwork: chosenNetwork,
        registrationState: {
            ...initialRegistrationState,
            connectedAddress: address
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
