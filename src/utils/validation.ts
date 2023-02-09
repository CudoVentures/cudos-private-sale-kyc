import { bech32 } from "bech32"

export const isValidCudosAddress = (addr: string) => {
  if (addr === '' || addr === undefined) return false
  try {
    const { prefix: decodedPrefix } = bech32.decode(addr)
    return decodedPrefix === "cudos"

  } catch {
    // invalid checksum
    return false
  }
}

export const isValidAmount = (amount: string) => {
  if (amount === '' || amount === undefined) return false
  const tempAmount = amount.replace(',', '.')
  const amountCheck = tempAmount.replace(/^(0|[1-9]\d*)(\.\d+)?(e-?(0|[1-9]\d*))?$/i, 'OK')
  return amountCheck === 'OK'
}
