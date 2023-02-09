// Makes token amounts human readable (by adding decimals) while keeps precision
// For instance: if we have 990099.000364464662179907 denoms on the chain =>

import { Coin } from "cudosjs";
import { checkForAdminToken } from "./helpers";

// The human readable form will be 990,099.000364464662179907
export const separateDecimals = (amount: string) => {
    return amount.replace(/\d{1,3}(?=(\d{3})+(?=\.))/gm, "$&,");
}

// Makes token amounts human readable while keeps precision
// It works on whole numbers by adding a point 
// For instance: if we have 990099000364464662179907 denoms on the chain =>
// The human readable form will be 990099.000364464662179907
export const separateFractions = (amount: string) => {
    if (amount.length < 19) {
        const zero = "0";
        const zeroTimes = 19 - amount.length;
        amount = zero.repeat(zeroTimes) + amount;
    }
    return amount.replace(/(?=(.{18}){1}$)/gm, ".");
}

// 990,099.000364464660009000 => 990,099.000364464660009
export const cutTrailingZeroes = (amount: string) => {
    return amount.replace(/(\.0+|0+)$/gm, "");
}

// 990,099.000364464660009000 => 990,099
export const cutFractions = (amount: string) => {
    return amount.replace(/\.[0-9]+/gm, "")
}

// 990,099.000364464660009000 => 990,099.{precision}
export const setDecimalPrecisionTo = (amount: string, precision: number): string => {
    const tempString = amount.split('.')
    if (tempString[0] && tempString[1]) {
        return `${tempString[0]}.${tempString[1].slice(0, precision)}`
    }
    return "0"
}

// TODO: handleFullBalanceToPrecision, handleBalanceToFullBalance and dependant functions 
// should be revised to be able to handle CW20 tokens with custom decimal precisions
export const handleFullBalanceToPrecision = (balance: Coin, precision: number): string => {
    const isAdmin = checkForAdminToken([balance])
    const tempDenom = balance.denom?.toLowerCase() === 'acudos' ? 'CUDOS' : balance.denom
    const tempAmount = isAdmin ? balance.amount : separateDecimals(separateFractions(balance.amount))
    const formatedAmount = isAdmin ? tempAmount : setDecimalPrecisionTo(tempAmount, precision)
    return tempDenom ? `${formatedAmount} ${tempDenom.toUpperCase()}` : formatedAmount
}

export const handleBalanceToFullBalance = (balance: Coin): string => {
    const isAdmin = checkForAdminToken([balance])
    return isAdmin ? balance?.amount! : separateDecimals(separateFractions(balance?.amount!))
}
