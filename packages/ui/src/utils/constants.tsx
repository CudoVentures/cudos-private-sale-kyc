import moment from "moment"
import cudosLogo from 'assets/vectors/cudos-logo.svg'
import cudosAdminLogo from 'assets/vectors/cudos-admin-logo.svg'
import { ReactComponent as TwitterIcon } from 'assets/vectors/twitter.svg'
import { ReactComponent as DiscordIcon } from 'assets/vectors/discord.svg'
import { SUPPORTED_WALLET } from "cudosjs"
import { FOOTER_LOGO } from "components/FooterLogo"

// CONFIGURATIONS
export const APP_DETAILS = {
    fadeTimeOut: 1500,
    apiKey: import.meta.env.VITE_APP_API_KEY || process.env.VITE_APP_API_KEY || "",
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
    DEFAULT_NETWORK: import.meta.env.VITE_APP_DEFAULT_NETWORK || process.env.VITE_APP_DEFAULT_NETWORK || "",
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
    RPC_ADDRESS: {
        LOCAL: import.meta.env.VITE_APP_LOCAL_RPC || process.env.VITE_APP_LOCAL_RPC || "",
        PRIVATE: import.meta.env.VITE_APP_PRIVATE_RPC || process.env.VITE_APP_PRIVATE_RPC || "",
        PUBLIC: import.meta.env.VITE_APP_PUBLIC_RPC || process.env.VITE_APP_PUBLIC_RPC || "",
        MAINNET: import.meta.env.VITE_APP_MAINNET_RPC || process.env.VITE_APP_MAINNET_RPC || ""
    },
    API_ADDRESS: {
        LOCAL: import.meta.env.VITE_APP_LOCAL_API || process.env.VITE_APP_LOCAL_API || "",
        PRIVATE: import.meta.env.VITE_APP_PRIVATE_API || process.env.VITE_APP_PRIVATE_API || "",
        PUBLIC: import.meta.env.VITE_APP_PUBLIC_API || process.env.VITE_APP_PUBLIC_API || "",
        MAINNET: import.meta.env.VITE_APP_MAINNET_API || process.env.VITE_APP_MAINNET_API || ""
    },
    STAKING_URL: {
        LOCAL: import.meta.env.VITE_APP_LOCAL_STAKING_URL || process.env.VITE_APP_LOCAL_STAKING_URL || "",
        PRIVATE: import.meta.env.VITE_APP_PRIVATE_STAKING_URL || process.env.VITE_APP_PRIVATE_STAKING_URL || "",
        PUBLIC: import.meta.env.VITE_APP_PUBLIC_STAKING_URL || process.env.VITE_APP_PUBLIC_STAKING_URL || "",
        MAINNET: import.meta.env.VITE_APP_MAINNET_STAKING_URL || process.env.VITE_APP_MAINNET_STAKING_URL || ""
    },
    EXPLORER_URL: {
        LOCAL: import.meta.env.VITE_APP_LOCAL_EXPLORER_URL || process.env.VITE_APP_LOCAL_EXPLORER_URL || "",
        PRIVATE: import.meta.env.VITE_APP_PRIVATE_EXPLORER_URL || process.env.VITE_APP_PRIVATE_EXPLORER_URL || "",
        PUBLIC: import.meta.env.VITE_APP_PUBLIC_EXPLORER_URL || process.env.VITE_APP_PUBLIC_EXPLORER_URL || "",
        MAINNET: import.meta.env.VITE_APP_MAINNET_EXPLORER_URL || process.env.VITE_APP_MAINNET_EXPLORER_URL || ""
    },
    CHAIN_NAME: {
        LOCAL: import.meta.env.VITE_APP_LOCAL_CHAIN_NAME || process.env.VITE_APP_LOCAL_CHAIN_NAME || "",
        PRIVATE: import.meta.env.VITE_APP_PRIVATE_CHAIN_NAME || process.env.VITE_APP_PRIVATE_CHAIN_NAME || "",
        PUBLIC: import.meta.env.VITE_APP_PUBLIC_CHAIN_NAME || process.env.VITE_APP_PUBLIC_CHAIN_NAME || "",
        MAINNET: import.meta.env.VITE_APP_MAINNET_CHAIN_NAME || process.env.VITE_APP_MAINNET_CHAIN_NAME || ""
    },
    CHAIN_ID: {
        LOCAL: import.meta.env.VITE_APP_LOCAL_CHAIN_ID || process.env.VITE_APP_LOCAL_CHAIN_ID || "",
        PRIVATE: import.meta.env.VITE_APP_PRIVATE_CHAIN_ID || process.env.VITE_APP_PRIVATE_CHAIN_ID || "",
        PUBLIC: import.meta.env.VITE_APP_PUBLIC_CHAIN_ID || process.env.VITE_APP_PUBLIC_CHAIN_ID || "",
        MAINNET: import.meta.env.VITE_APP_MAINNET_CHAIN_ID || process.env.VITE_APP_MAINNET_CHAIN_ID || ""
    },
    LOCAL: {
        ALIAS_NAME: 'CUDOS Local Testnet',
        SHORT_NAMES: ['local']
    },
    PRIVATE: {
        ALIAS_NAME: 'CUDOS Private Testnet',
        SHORT_NAMES: ['private']
    },
    PUBLIC: {
        ALIAS_NAME: 'CUDOS Public Testnet',
        SHORT_NAMES: ['public']
    },
    MAINNET: {
        ALIAS_NAME: 'CUDOS Main Network',
        SHORT_NAMES: ['mainnet', 'cudos-1']
    }
}

export const DENOM_TO_ICON = {
    'acudos': cudosLogo,
    'cudos': cudosLogo,
    'cudosAdmin': cudosAdminLogo
}

export const DENOM_TO_ALIAS = {
    'acudos': "CUDOS",
    'cudosAdmin': 'ADMIN TOKENS'
}

export const LEDGERS = {
    KEPLR: SUPPORTED_WALLET.Keplr,
    COSMOSTATION: SUPPORTED_WALLET.Cosmostation
}

export const FOOTER = {
    LEFT_LINKS: [
        { text: <FOOTER_LOGO />, url: 'https://www.aurapool.io' },
        { text: 'Terms & Conditions', url: 'https://www.aurapool.io/terms-and-conditions/' },
        { text: 'Privacy Policy', url: 'https://www.aurapool.io/privacy-policy/' },
        { text: 'aurapool.io', url: 'https://www.aurapool.io' },
        { text: `License © ${moment().year()}`, url: 'https://www.aurapool.io' },
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