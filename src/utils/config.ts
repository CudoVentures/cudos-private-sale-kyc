import { connectCosmostationLedger } from "ledgers/CosmostationLedger"
import { connectKeplrLedger } from "ledgers/KeplrLedger"
import { userState } from "store/user"

import { LEDGERS } from "./constants"
import { getConnectedUserAddressAndName} from "./helpers"

export const connectUser = async (chosenNetwork: string, ledgerType: string): Promise<userState> => {

    const { address, accountName } = await getConnectedUserAddressAndName(chosenNetwork, ledgerType)

    const connectedUser: userState = {
        accountName: accountName,
        address: address,
        connectedLedger: ledgerType,
        chosenNetwork: chosenNetwork,
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
