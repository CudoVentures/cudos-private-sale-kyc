export { }

declare global {

    type Override<T1, T2> = Omit<T1, keyof T2> & T2

    interface Window {
        keplr: any
        cosmostation: any
        getOfflineSigner: any
        getOfflineSignerOnlyAmino: any
        meta: any
    }

    interface networkToDisplay {
        ALIAS_NAME: string;
        SHORT_NAMES: string[];
    }

    type ComponentDefault = {
        className?: string
    }

    interface ImportMetaEnv {
        VITE_APP_LOCAL_RPC: string
        VITE_APP_LOCAL_API: string
        VITE_APP_LOCAL_EXPLORER_URL: string
        VITE_APP_LOCAL_STAKING_URL: string
        VITE_APP_LOCAL_CHAIN_NAME: string
        VITE_APP_LOCAL_CHAIN_ID: string
        VITE_APP_PRIVATE_RPC: string
        VITE_APP_PRIVATE_API: string
        VITE_APP_PRIVATE_EXPLORER_URL: string
        VITE_APP_PRIVATE_STAKING_URL: string
        VITE_APP_PRIVATE_CHAIN_NAME: string
        VITE_APP_PRIVATE_CHAIN_ID: string
        VITE_APP_PUBLIC_RPC: string
        VITE_APP_PUBLIC_API: string
        VITE_APP_PUBLIC_EXPLORER_URL: string
        VITE_APP_PUBLIC_STAKING_URL: string
        VITE_APP_PUBLIC_CHAIN_NAME: string
        VITE_APP_PUBLIC_CHAIN_ID: string
        VITE_APP_MAINNET_RPC: string
        VITE_APP_MAINNET_API: string
        VITE_APP_MAINNET_EXPLORER_URL: string
        VITE_APP_MAINNET_STAKING_URL: string
        VITE_APP_MAINNET_CHAIN_NAME: string
        VITE_APP_MAINNET_CHAIN_ID: string
        VITE_APP_DEFAULT_NETWORK: string
        VITE_APP_GAS_PRICE: string
    }
}

declare module '@mui/material/styles' {

    interface Theme {
        custom: {
            backgrounds: {
                light: string
                primary: string
                dark: string
            }
        }
    }

    interface ThemeOptions {
        custom?: {
            backgrounds?: {
                light?: string
                primary?: string
                dark?: string
            }
        }
    }
}
