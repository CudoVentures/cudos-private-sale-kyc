import axios from "axios"
import { GET_COINGECKO_CURRENCY_URL } from "./endpoints"

export const getCurrencyRate = async (currency: string) => {
    return axios.get(`${GET_COINGECKO_CURRENCY_URL(currency)}`)
  }
