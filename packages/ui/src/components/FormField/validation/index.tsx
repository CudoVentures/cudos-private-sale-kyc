import { bech32 } from "bech32"
import { nftTiersState } from "store/nftTiers"
import { NftTier, PrivateSaleFields } from "store/user"
import isEmail from "validator/lib/isEmail"
import { APP_DETAILS } from "utils/constants"
import { kycStatus } from "utils/onfido"
import { PublicKey as SolanaPublicKey } from '@solana/web3.js'

import { Currencies, FormField, FormFieldErrors } from "../types"

export const isZeroLength = (data: any): boolean => !data

export const isValidLength = (data: string, spec?: { min?: number, max?: number }): boolean => {
    const { min, max } = spec!
    return (min ? data.length > min : true) && (max ? data.length < max : true)
}

export const sanitizeString = (string: string): string => {
    const sanitizedString = string
        .replaceAll(' ', '')
        .replaceAll('.', '')
        .replaceAll(',', '')
    return sanitizedString
}

export const isValidCudosAddress = (addr: string): { isValid: boolean, tooltip: string } => {
    try {
        const { prefix: decodedPrefix } = bech32.decode(addr)
        const isValidAddress = decodedPrefix === "cudos"
        return { isValid: isValidAddress, tooltip: isValidAddress ? '' : FormFieldErrors.invalidCudosAddress }

    } catch {
        return { isValid: false, tooltip: FormFieldErrors.invalidCudosAddress }
    }
}

export const isValidName = (name: string): { isValid: boolean, tooltip: string } => {
    if (isZeroLength(name) || /^[a-zA-Z]+$/gm.test(name)) {
        return { isValid: true, tooltip: '' }
    }
    return { isValid: false, tooltip: FormFieldErrors.invalidName }
}

export const isValidEmail = (email: string): { isValid: boolean, tooltip: string } => {
    if (isZeroLength(email) || isEmail(email)) {
        return { isValid: true, tooltip: '' }
    }
    return { isValid: false, tooltip: FormFieldErrors.invalidEmail }
}

export const isValidNftCount = (count: number): { isValid: boolean, tooltip: string } => {
    if (count <= 20) {
        return { isValid: true, tooltip: '' }
    }
    return { isValid: false, tooltip: FormFieldErrors.invalidNftCount }
}

export const isValidEthereumAddress = (address: string) => {
    const regex = /^0x[a-fA-F0-9]{40}$/;
    if (regex.test(address)) {
        return { isValid: true, tooltip: '' }
    }
    return { isValid: false, tooltip: FormFieldErrors.invalidEthereumAddress }
}

export const isValidSolanaAddress = (address: string) => {
    try {
        const publicKey = new SolanaPublicKey(address)
        if (publicKey.toBase58() === address) {
            return { isValid: true, tooltip: '' }
        } else {
            throw new Error('Invalid checksum')
        }
    } catch (error) {
        return { isValid: false, tooltip: FormFieldErrors.invalidSolanaAddress }
    }
}

export const isValidExternalWallet = (payerWalletAddress: string, chosenCurrency: Currencies): { isValid: boolean, tooltip: string } => {
    if (isZeroLength(payerWalletAddress)) {
        return { isValid: true, tooltip: '' }
    }
    switch (chosenCurrency) {
        case Currencies.ETH:
        case Currencies.USDC:
        case Currencies.USDT:
            return isValidEthereumAddress(payerWalletAddress)
        case Currencies.SOL:
            return isValidSolanaAddress(payerWalletAddress)
        case Currencies.CUDOS:
            return isValidCudosAddress(payerWalletAddress)
        default:
            return { isValid: true, tooltip: '' }
    }
}

export const isValidInternalWallet = (internalWallet: string): { isValid: boolean, tooltip: string } => {
    const predefinedWallets = Object.values(APP_DETAILS.internalAddresses)
    if (predefinedWallets.includes(internalWallet)) {
        return { isValid: true, tooltip: '' }
    }
    return { isValid: false, tooltip: 'Invalid Internal Wallet' }
}

export const getTiersTotalSum = (tiers: Record<string, NftTier>) => {
    let amount = 0
    Array.from(Object.values(tiers)).forEach((value) => {
        amount += (value.cost * value.qty)
    })
    return amount
}

export const isValidTiersTotal = (tiers: Record<string, NftTier>) => {
    if (getTiersTotalSum(tiers) >= 1275) {
        return { isValid: true, tooltip: '' }
    }
    return { isValid: false, tooltip: FormFieldErrors.invalidTiersTotal }
}

export const isValidTiers = (tiers: Record<string, NftTier>, nonSubmit?: boolean, available?: nftTiersState) => {
    const count = Object.values(tiers!).reduce((acc, { qty }) => acc + qty, 0)
    if (count && available) {
        let totalCount = 0
        for (const [tierName, { qty }] of Object.entries(tiers)) {
            totalCount += qty
            if (totalCount > available?.limit!) {
                return { isValid: false, tooltip: `Maximum ${available?.limit!} in total` }
            }
            if (qty > available![tierName]) {
                return { isValid: false, tooltip: `Only ${available![tierName]} ${tierName}s are available` }
            }
        }
    }
    if ((!count && nonSubmit) || (count && count <= available?.limit!)) {
        return { isValid: true, tooltip: '' }
    }
    return { isValid: false, tooltip: `Maximum ${available?.limit!} in total` }
}

export const getFieldisValid = (
    fieldType: FormField,
    value: any,
    props?: {
        nonSubmit: boolean,
        tierData?: nftTiersState,
        chosenCurrency?: Currencies
    }
): { isValid: boolean, tooltip: string } => {

    switch (fieldType) {
        case FormField.connectedAddress:
            return isValidCudosAddress(value)
        case FormField.firstName:
        case FormField.lastName:
            return isValidName(value)
        case FormField.email:
            return isValidEmail(value)
        case FormField.nftCount:
            return isValidNftCount(value)
        case FormField.payerWalletAddress:
            return isValidExternalWallet(value, props?.chosenCurrency!)
        case FormField.nftTiers:
            return isValidTiers(value, props?.nonSubmit, props?.tierData)
        case FormField.nftTiersTotal:
            return isValidTiersTotal(value)
        default:
            return { isValid: true, tooltip: '' }
    }
}

export const isValidSubmit = (chosenCurrency?: Currencies, registrationState?: PrivateSaleFields, tierData?: nftTiersState): boolean => {
    const { isValid: validTiers } = isValidTiers(registrationState?.nftTiers!, false, tierData)
    const { isValid: validTiersTotal } = isValidTiersTotal(registrationState?.nftTiers!)
    const { isValid: validExternalWallet } = isValidExternalWallet(registrationState?.payerWalletAddress!, chosenCurrency!)
    const { isValid: validConnectedAddress } = isValidCudosAddress(registrationState?.connectedAddress!)
    const { isValid: validFirstName } = isValidName(registrationState?.firstName!)
    const { isValid: validLastName } = isValidName(registrationState?.lastName!)
    const { isValid: validEmail } = isValidEmail(registrationState?.email!)
    if (
        registrationState?.kycStatus === kycStatus.verificationSuccessful &&
        chosenCurrency &&
        validTiers &&
        validTiersTotal &&
        validConnectedAddress &&
        registrationState?.tocAgreed &&
        (registrationState.email && validEmail) &&
        (registrationState.lastName && validLastName) &&
        (registrationState.firstName && validFirstName) &&
        (registrationState.payerWalletAddress && validExternalWallet)
    ) { return true }
    return false
}
