import { KeplrWallet } from 'cudosjs'
import { CHAIN_DETAILS } from 'utils/constants'

export const connectKeplrLedger = async (): Promise<{ address: string; accountName: string; }> => {

    if (!window.keplr) {
        throw new Error("Keplr extension not found")
    }

    const wallet = new KeplrWallet({
        CHAIN_ID: CHAIN_DETAILS.CHAIN_ID,
        CHAIN_NAME: CHAIN_DETAILS.CHAIN_NAME,
        RPC: CHAIN_DETAILS.RPC_ADDRESS,
        API: CHAIN_DETAILS.API_ADDRESS,
        STAKING: CHAIN_DETAILS.STAKING_URL,
        GAS_PRICE: CHAIN_DETAILS.GAS_PRICE.toString()
    })

    await wallet.connect()

    const key = await window.keplr.getKey(CHAIN_DETAILS.CHAIN_ID)

    return { address: key.bech32Address, accountName: key.name }
}

export const getKeplrAddress = async (): Promise<string> => {
    const key = await window.keplr!.getKey(CHAIN_DETAILS.CHAIN_ID)
    return key.bech32Address;
}
