import { KeplrWallet } from 'cudosjs'
import { CHAIN_DETAILS } from 'utils/constants'

export const connectKeplrLedger = async (chosenNetwork: string): Promise<{ address: string; accountName: string; }> => {

    if (!window.keplr) {
        throw new Error("Keplr extension not found")
    }

    const wallet = new KeplrWallet({
        CHAIN_ID: CHAIN_DETAILS.CHAIN_ID[chosenNetwork],
        CHAIN_NAME: CHAIN_DETAILS.CHAIN_NAME[chosenNetwork],
        RPC: CHAIN_DETAILS.RPC_ADDRESS[chosenNetwork],
        API: CHAIN_DETAILS.API_ADDRESS[chosenNetwork],
        STAKING: CHAIN_DETAILS.STAKING_URL[chosenNetwork],
        GAS_PRICE: CHAIN_DETAILS.GAS_PRICE.toString()
    })

    await wallet.connect()

    const key = await window.keplr.getKey(CHAIN_DETAILS.CHAIN_ID[chosenNetwork])

    return { address: key.bech32Address, accountName: key.name }
}

export const getKeplrAddress = async (chosenNetwork: string): Promise<string> => {
    const key = await window.keplr!.getKey(CHAIN_DETAILS.CHAIN_ID[chosenNetwork])
    return key.bech32Address;
}
