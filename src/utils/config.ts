import { StargateClient } from "cudosjs"
import { connectCosmostationLedger } from "ledgers/CosmostationLedger"
import { connectKeplrLedger } from "ledgers/KeplrLedger"
import { userState } from "store/user"
import { CHAIN_DETAILS, LEDGERS } from "./constants"

import {
    checkForAdminToken,
    getAccountBalances,
    getConnectedUserAddressAndName,
    getNativeBalance
} from "./helpers"

export const getQueryClient = async (chosenNetwork: string): Promise<StargateClient> => {
    const client = await StargateClient.connect(CHAIN_DETAILS.RPC_ADDRESS[chosenNetwork!])
    return client
}

export const connectUser = async (chosenNetwork: string, ledgerType: string): Promise<userState> => {

    const { address, accountName } = await getConnectedUserAddressAndName(chosenNetwork, ledgerType)
    const currentBalances = await getAccountBalances(chosenNetwork, address)
    const isAdmin = checkForAdminToken(currentBalances)
    const userNativeBalance = getNativeBalance(currentBalances)

    const connectedUser: userState = {
        accountName: accountName,
        address: address,
        isAdmin: isAdmin,
        balances: currentBalances,
        nativeBalance: userNativeBalance,
        connectedLedger: ledgerType,
        chosenNetwork: chosenNetwork,
        chosenBalance: { denom: CHAIN_DETAILS.NATIVE_TOKEN_DENOM, amount: userNativeBalance }
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
