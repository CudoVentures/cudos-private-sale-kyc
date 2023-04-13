import moment from "moment"
import { ReactComponent as TwitterIcon } from 'assets/vectors/twitter.svg'
import { ReactComponent as DiscordIcon } from 'assets/vectors/discord.svg'
import { SUPPORTED_WALLET } from "cudosjs"
import { ReactComponent as AuraPoolLogo } from 'assets/vectors/aura-pool-logo.svg'

// CONFIGURATIONS
export const APP_DETAILS = {
    fadeTimeOut: 1500,
    apiKey: import.meta.env.VITE_APP_API_KEY || process.env.VITE_APP_API_KEY || "",
    DEPLOYMENT_VERSION: import.meta.env.VITE_APP_DEPLOYMENT_VERSION || process.env.VITE_APP_DEPLOYMENT_VERSION || "",
    GET_CURRENCY_RATES_URL: import.meta.env.VITE_APP_GET_CURRENCY_RATES_URL || process.env.VITE_APP_GET_CURRENCY_RATES_URL || "",
    internalAddresses: {
        SOLANA: import.meta.env.VITE_APP_SOLANA_ADDRESS || process.env.VITE_APP_SOLANA_ADDRESS || "",
        ETHEREUM: import.meta.env.VITE_APP_ETHEREUM_ADDRESS || process.env.VITE_APP_ETHEREUM_ADDRESS || "",
        CUDOS: import.meta.env.VITE_APP_CUDOS_ADDRESS || process.env.VITE_APP_CUDOS_ADDRESS || ""
    }
}

export const CHAIN_DETAILS = {
    ADMIN_TOKEN_DENOM: 'cudosAdmin',
    NATIVE_TOKEN_DENOM: 'acudos',
    CURRENCY_DISPLAY_NAME: 'CUDOS',
    GAS_PRICE: import.meta.env.VITE_APP_GAS_PRICE || process.env.VITE_APP_GAS_PRICE || "",
    KYC_REGISTER_APPLICANT_URL: import.meta.env.VITE_APP_KYC_REGISTER_APPLICANT_URL || process.env.VITE_APP_KYC_REGISTER_APPLICANT_URL || "",
    KYC_CREATE_WORKFLOW_RUN_URL: import.meta.env.VITE_APP_KYC_CREATE_WORKFLOW_RUN_URL || process.env.VITE_APP_KYC_CREATE_WORKFLOW_RUN_URL || "",
    KYC_GET_RESUME_FLOW_TOKEN_URL: import.meta.env.VITE_APP_KYC_GET_RESUME_FLOW_TOKEN_URL || process.env.VITE_APP_KYC_GET_RESUME_FLOW_TOKEN_URL || "",
    KYC_GET_WORKFLOW_DETAILS_BASE_URL: import.meta.env.VITE_APP_KYC_GET_WORKFLOW_DETAILS_BASE_URL || process.env.VITE_APP_KYC_GET_WORKFLOW_DETAILS_BASE_URL || "",
    NFT_DEDUCT_URL: import.meta.env.VITE_APP_NFT_DEDUCT_URL || process.env.VITE_APP_NFT_DEDUCT_URL || "",
    FIREBASE: {
        AUTH_VERIFY_URL: import.meta.env.VITE_APP_FIREBASE_AUTH_VERIFY_URL || process.env.VITE_APP_FIREBASE_AUTH_VERIFY_URL || "",
        AUTH_NONCE_URL: import.meta.env.VITE_APP_FIREBASE_AUTH_NONCE_URL || process.env.VITE_APP_FIREBASE_AUTH_NONCE_URL || "",
        COLLECTION: import.meta.env.VITE_APP_FIREBASE_COLLECTION || process.env.VITE_APP_FIREBASE_COLLECTION || "",
        DOMAIN: import.meta.env.VITE_APP_FIREBASE_DOMAIN || process.env.VITE_APP_FIREBASE_DOMAIN || "",
        PROJECT_ID: import.meta.env.VITE_APP_FIREBASE_PROJECT_ID || process.env.VITE_APP_FIREBASE_PROJECT_ID || "",
        API_KEY: import.meta.env.VITE_APP_FIREBASE_API_KEY || process.env.VITE_APP_FIREBASE_API_KEY || ""
    },
    RPC_ADDRESS: import.meta.env.VITE_APP_RPC || process.env.VITE_APP_RPC || "",
    API_ADDRESS: import.meta.env.VITE_APP_API || process.env.VITE_APP_API || "",
    STAKING_URL: import.meta.env.VITE_APP_STAKING_URL || process.env.VITE_APP_STAKING_URL || "",
    EXPLORER_URL: import.meta.env.VITE_APP_EXPLORER_URL || process.env.VITE_APP_EXPLORER_URL || "",
    CHAIN_NAME: import.meta.env.VITE_APP_CHAIN_NAME || process.env.VITE_APP_CHAIN_NAME || "",
    CHAIN_ID: import.meta.env.VITE_APP_CHAIN_ID || process.env.VITE_APP_CHAIN_ID || "",
}

export const LEDGERS = {
    KEPLR: SUPPORTED_WALLET.Keplr,
    COSMOSTATION: SUPPORTED_WALLET.Cosmostation
}

export const FOOTER = {
    LEFT_LINKS: [
        { text: <AuraPoolLogo style={{ height: '40px' }} />, url: 'https://www.aurapool.io' },
        { text: 'Terms & Conditions', url: 'https://www.aurapool.io/terms-and-conditions/' },
        { text: 'Privacy Policy', url: 'https://www.aurapool.io/privacy-policy' },
        { text: 'aurapool.io', url: 'https://www.aurapool.io' },
        { text: `License © ${moment().year()}`, url: 'https://www.aurapool.io' },
        { text: `${APP_DETAILS.DEPLOYMENT_VERSION}`, url: `https://github.com/CudoVentures/cudos-private-sale-kyc/releases/tag/${APP_DETAILS.DEPLOYMENT_VERSION}` }
    ],
    RIGHT_LINKS: [
        { icon: <TwitterIcon />, url: 'https://twitter.com/AuraPool_' },
        { icon: <DiscordIcon />, url: 'https://discord.com/invite/aurapool' },

    ]
}

// MODAL MSGS
export const MODAL_MSGS = {
    ERRORS: {
        TITLES: {
            LOGIN_FAIL: 'Login Failed'
        },
        MESSAGES: {
            LOGIN_FAIL: 'Seems like something went wrong. Please try again later'
        }
    }
}