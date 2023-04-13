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

    type ComponentDefault = {
        className?: string
    }

    interface ImportMetaEnv {
        VITE_APP_RPC: string
        VITE_APP_API: string
        VITE_APP_EXPLORER_URL: string
        VITE_APP_STAKING_URL: string
        VITE_APP_CHAIN_NAME: string
        VITE_APP_CHAIN_ID: string
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
