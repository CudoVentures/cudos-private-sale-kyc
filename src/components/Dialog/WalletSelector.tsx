import { Fragment, useEffect, useState } from 'react'
import { Box, Tooltip, Typography, Dialog as MuiDialog } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { ThreeDots as ThreeDotsLoading } from 'svg-loaders-react'
import { useDispatch, useSelector } from 'react-redux'
import {
    detectUserBrowser,
    getExtensionUrlForBrowser,
    getSupportedBrowsersForWallet,
    getSupportedWallets,
    isExtensionAvailableForBrowser,
    isExtensionEnabled,
    isSupportedBrowser,
    SUPPORTED_BROWSER,
    SUPPORTED_WALLET
} from 'cudosjs'

import { CancelRoundedIcon, ModalContainer, styles as defaultStyles, walletSelectorStyles } from './styles'
import { updateUser } from 'store/user'
import { initialState, updateModalState } from 'store/modals'
import { RootState } from 'store'
import { connectUser } from 'utils/config'

import { ReactComponent as KeplrLogo } from 'assets/vectors/keplr-logo.svg'
import { ReactComponent as CosmostationLogo } from 'assets/vectors/cosmostation-logo.svg'
import { ReactComponent as LinkIcon } from 'assets/vectors/link-icon.svg'
import { ReactComponent as InfoIcon } from 'assets/vectors/info-icon.svg'
import { styles } from 'containers/ConnectWallet/styles'

export const SUPPORTED_WALLET_LOGOS = {
    [SUPPORTED_WALLET.Keplr]: <KeplrLogo style={styles.keplrLogo} />,
    [SUPPORTED_WALLET.Cosmostation]: <CosmostationLogo style={styles.cosmostationLogo} />
}

const WalletSelector = () => {

    const { chosenNetwork } = useSelector((state: RootState) => state.userState)
    const { selectWallet } = useSelector((state: RootState) => state.modalState)
    const [userBrowser, setUserBrowser] = useState<SUPPORTED_BROWSER | undefined>(undefined)
    const [loading, setLoading] = useState(new Map())
    const dispatch = useDispatch()

    const redirectToExtension = (extensionUrl: string | undefined) => {
        if (extensionUrl) {
            window.open(extensionUrl, 'get-wallet-extension')?.focus()
        }
    }

    const connect = async (walletName: SUPPORTED_WALLET) => {

        try {
            setLoading(new Map(loading.set(walletName, true)))
            const connectedUser = await connectUser(chosenNetwork!, walletName)
            dispatch(updateUser(connectedUser))
            handleModalClose()

        } catch (error) {
            // TODO: Failure modal here
            console.error((error as Error).message)

        } finally {
            setLoading(new Map())
        }
    }

    const handleModalClose = () => {
        dispatch(updateModalState(initialState))
    }

    const LoadingButtonComponent = (): JSX.Element => {
        return (
            <ThreeDotsLoading
                style={{ width: '30px', height: '30px' }}
            />
        )
    }

    const btnTooltip = (walletName: SUPPORTED_WALLET): string => {
        let tooltipText = ''

        if (!isExtensionAvailableForBrowser(walletName, userBrowser!)) {
            tooltipText = `${walletName} supports: ${getSupportedBrowsersForWallet(walletName).map((browser) => {
                return ` ${browser}`
            })}`
        }

        return tooltipText
    }

    const isDisabledBtn = (walletName: SUPPORTED_WALLET): boolean => {

        // Disabling the Btn if into loading state
        if (loading.get(walletName)) {
            return true
        }

        // Disabling the btn, when other btn is loading
        if (loading.size > 0) {
            return true
        }

        // Disabling the btn if no extension is available for the current user browser
        if (!isExtensionAvailableForBrowser(walletName, userBrowser!)) {
            return true
        }

        return false
    }

    const click = async (walletName: SUPPORTED_WALLET) => {

        if (isExtensionEnabled(walletName)) {
            await connect(walletName)
            return
        }

        const extensionUrl = getExtensionUrlForBrowser(walletName, userBrowser!)
        redirectToExtension(extensionUrl)
    }

    const displayLogo = (walletName: SUPPORTED_WALLET): JSX.Element => {
        if (loading.get(walletName)) {
            return <Fragment></Fragment>
        }
        return SUPPORTED_WALLET_LOGOS[walletName] || <Fragment></Fragment>
    }

    const btnText = (walletName: SUPPORTED_WALLET): string | JSX.Element => {

        if (loading.get(walletName)) {
            return ''
        }

        if (isExtensionEnabled(walletName)) {
            return `Connect ${walletName.toUpperCase()}`
        }

        if (isExtensionAvailableForBrowser(walletName, userBrowser!)) {
            return (
                <Typography variant='subtitle2' sx={{ display: 'flex', alignItems: 'center' }}>
                    {`Get ${walletName} plugin`}
                    <LinkIcon style={{ marginLeft: '5px' }} />
                </Typography>
            )
        }

        return 'Unsupported browser'
    }

    useEffect(() => {
        const userBrowser = detectUserBrowser()
        if (isSupportedBrowser(userBrowser)) {
            setUserBrowser(userBrowser as SUPPORTED_BROWSER)
            return
        }
        setUserBrowser(undefined)
    }, [])

    return (
        <MuiDialog
            BackdropProps={defaultStyles.defaultBackDrop}
            open={selectWallet!}
            onClose={handleModalClose}
            PaperProps={defaultStyles.defaultPaperProps}
        >
            <ModalContainer id="FUCKER" sx={{ padding: '25px 25px 20px 30px' }}>
                <CancelRoundedIcon onClick={handleModalClose} />
                <Box sx={walletSelectorStyles.contentHolder}>
                    <Typography
                        style={{ margin: '20px 0 20px 0' }}
                        variant="h4"
                        fontWeight={900}
                        letterSpacing={2}
                    >
                        Connect Wallet
                    </Typography>
                    <Typography marginBottom={3} variant="subtitle1" color="text.secondary">
                        Connect your wallet in order to create an Allowlist
                    </Typography>
                    <Box gap={3} style={walletSelectorStyles.btnsHolder}>

                        {getSupportedWallets().map((wallet, idx) => {
                            return (
                                <Tooltip key={idx} placement='right' title={btnTooltip(wallet)}>
                                    <Box width='100%'>
                                        <LoadingButton
                                            loadingIndicator={<LoadingButtonComponent />}
                                            disabled={isDisabledBtn(wallet)}
                                            loading={loading.get(wallet)}
                                            variant="contained"
                                            color="primary"
                                            onClick={() => click(wallet)}
                                            sx={walletSelectorStyles.connectButton}
                                        >
                                            {displayLogo(wallet)}
                                            {btnText(wallet)}
                                        </LoadingButton>
                                    </Box>
                                </Tooltip>
                            )
                        })}
                        <Box sx={walletSelectorStyles.pluginWarning} color="primary.main">
                            <InfoIcon style={walletSelectorStyles.infoIcon} />
                            Make sure you have Keplr and/or Cosmostation plugins enabled.
                        </Box>
                    </Box>
                </Box>
            </ModalContainer>
        </MuiDialog>
    )
}

export default WalletSelector
