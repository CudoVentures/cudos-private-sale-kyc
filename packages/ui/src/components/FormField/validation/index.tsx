import { bech32 } from "bech32"
import { NftTier, PrivateSaleFields } from "store/user"
import isEmail from "validator/lib/isEmail"

import { FormField, FormFieldErrors } from "../types"

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

export const isValidAmountToSpend = (amount: string): { isValid: boolean, tooltip: string } => {
    let isValid = true
    let tooltip = ''
    if (!isZeroLength(amount)) {
        const parsedAmount = parseFloat(amount)
        if (!parsedAmount) {
            isValid = false
            tooltip = FormFieldErrors.invalidData
        } else if (parseFloat(amount) < 1000) {
            isValid = false
            tooltip = FormFieldErrors.shouldBeMoreThan
        }
    }
    return { isValid, tooltip }
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

export const isValidExternalWallet = (count: number): { isValid: boolean, tooltip: string } => {
    //TODO: Any validation for this?
    return { isValid: true, tooltip: '' }
}

export const isValidTiers = (tiers: Record<string, NftTier>) => {
    const any = Object.values(tiers).find((value) => value.qty > 0)
    if (any) {
        return true
    }
    return false
}

export const getFieldisValid = (fieldType: FormField, value: any): { isValid: boolean, tooltip: string } => {
    switch (fieldType) {
        case FormField.connectedAddress:
            return isValidCudosAddress(value)
        case FormField.firstName:
        case FormField.lastName:
            return isValidName(value)
        case FormField.amountToSpend:
            return isValidAmountToSpend(value)
        case FormField.email:
            return isValidEmail(value)
        case FormField.nftCount:
            return isValidNftCount(value)
        case FormField.externalWallet:
            return isValidExternalWallet(value)
        default:
            return { isValid: true, tooltip: '' }
    }
}

export const isValidSubmit = (registrationState?: PrivateSaleFields): boolean => {
    if (
        registrationState?.connectedAddress &&
        getFieldisValid(FormField.connectedAddress, registrationState?.connectedAddress) &&
        registrationState.firstName &&
        getFieldisValid(FormField.firstName, registrationState?.firstName) &&
        registrationState.lastName &&
        getFieldisValid(FormField.lastName, registrationState?.lastName) &&
        registrationState.amountToSpend &&
        getFieldisValid(FormField.amountToSpend, registrationState?.amountToSpend) &&
        registrationState.email &&
        getFieldisValid(FormField.email, registrationState?.email) &&
        isValidTiers(registrationState.nftTiers) &&
        // registrationState.nftTiers &&
        // getFieldisValid(FormField.nftCount, registrationState?.nftCount) &&
        registrationState.externalWallet &&
        getFieldisValid(FormField.externalWallet, registrationState?.externalWallet)
    ) { return true }
    return false
}