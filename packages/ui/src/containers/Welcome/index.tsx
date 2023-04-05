import { Box, Fade, Link, Typography } from '@mui/material'
import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Dialog from 'components/Dialog'
import { CurrencyToInternalWalletMapper, FormField } from 'components/FormField/types'
import { RootState } from 'store'

import { styles } from './styles'
import { APP_DETAILS } from 'utils/constants'
import { Navigate, useLocation } from 'react-router-dom'
import { getCurrencyRates } from 'api/calls'
import { updateRates } from 'store/rates'
import Pricelist from 'components/Pricelist'
import CompletedProcess from 'components/CompletedProcess'
import SaleForm from 'components/SaleForm'
import { getFlowStatus, kycStatus, sanitizeKycStatus } from 'utils/onfido'
import { COLORS_DARK_THEME } from 'theme/colors'
import { CopyComponent, PriceListTooltip } from 'components/helpers'
import CreationField from 'components/FormField'
import { NftTier } from 'store/user'
import { getTotalAmounts } from 'utils/helpers'
import { updateModalState } from 'store/modals'
import StatusStarter from 'components/StatusStarter'

const Welcome = () => {

  const location = useLocation()
  const dispatch = useDispatch()
  const userState = useSelector((state: RootState) => state.userState)
  const { currencyRates } = useSelector((state: RootState) => state.ratesState)

  const [loaded, setLoaded] = useState<boolean>(false)
  const [processCompleted, setProcessCompleted] = useState<boolean>(false)
  const [payeeWallet, setPayeeWallet] = useState<string>('')
  const [amountToSpend, setAmountToSpend] = useState<string>('')
  const [usdAmount, setUsdAmount] = useState<number>(0)
  const [currencyRate, setCurrencyRate] = useState<number>(0)
  const [nftTiers, setNftTiers] = useState<Record<string, NftTier> | undefined>(undefined)
  const [fetchedAt, setFetchedAt] = useState<Date | undefined>(undefined)

  const loadRates = async () => {
    const rates = await getCurrencyRates()
    console.log(rates)
    dispatch(updateRates({
      currencyRates: rates,
      fetchedAt: new Date()
    }))
  }

  const cleanUp = () => {
    // dispatch(updateUser({
    //   registrationState: {
    //     ...initialRegistrationState,
    //     connectedAddress: userState.address || '',
    //     kycApplicantId: userState.registrationState?.kycApplicantId || '',
    //     kycWorkflowRunId: userState.registrationState?.kycWorkflowRunId || '',
    //     kycStatus: userState.registrationState?.kycStatus || '',
    //     processCompleted: userState.registrationState?.processCompleted || false
    //   }
    // }))
  }

  const handleContent = useCallback(() => {
    if (loaded) {
      if (processCompleted) {
        return (
          <Box>
            <Box gap={4} sx={{ maxWidth: '1024px', display: 'flex', flexDirection: 'column', padding: '0rem 8rem' }}>
              <Typography sx={{ textAlign: 'justify' }} variant="h6">
                We have received your order successfully. Please proceed with the payment and we will get in touch with you shortly.
              </Typography>
              {payeeWallet ?
                <CreationField
                  type={FormField.internalWallet}
                  text={'Payee Wallet Address'}
                  value={payeeWallet}
                  placeholder={'AuraPool’s wallet address where you send money to'}
                  endAdornment={<CopyComponent textToCopy={payeeWallet} />}
                  isDisabled={true}
                /> : null}
              {amountToSpend ?
                <Box sx={{ display: 'flex' }}>
                  <CreationField
                    type={FormField.freeForm}
                    text={'Amount due'}
                    value={amountToSpend}
                    isDisabled={true}
                    endAdornment={nftTiers && usdAmount && currencyRate && amountToSpend && fetchedAt ?
                      <Box padding='12px' color={'black'}>
                        <PriceListTooltip
                          tiers={nftTiers}
                          usdAmount={usdAmount}
                          rate={currencyRate}
                          totalDue={amountToSpend}
                          fetchedAt={fetchedAt}
                        />
                      </Box> :
                      undefined}
                  />
                </Box> : null}
              <Typography component={'span'} variant="h6">
                {"  In the meantime, if you have any questions please reach out to us at "}
                < Link href={`mailto:enquiries@aurapool.io`
                } color={COLORS_DARK_THEME.PRIMARY_BLUE} >
                  enquiries@aurapool.io
                </Link >
              </Typography>
            </Box>
          </Box>
        )
      }

      if (userState.registrationState?.kycStatus === kycStatus.submissionCompleted) {
        return <CompletedProcess text={'We have received your documents. Please come back later or refresh the page to check on your verification status.'} />
      }
      if (userState.registrationState?.kycStatus === kycStatus.verificationSuccessful) {
        return <SaleForm />
      }

      return (
        <Box gap={4} sx={{ ...styles.welcomePricelistHolder, width: '500px' }}>
          {!userState.registrationState?.kycStatus ?
            <Typography marginTop={4} textAlign={'center'}>
              Please find below the NFTs that are still available for purchase. The next step to continue with the purchase is KYC, so please click 'Verify' to continue.
            </Typography> : null}
          <Box gap={8} sx={styles.welcomePricelistHolder}>
            {!userState.registrationState?.kycStatus ?
              <StatusStarter status={userState.registrationState?.kycStatus} customWidth={'100%'} /> : null}
            <Pricelist />
          </Box>
        </Box>
      )
    }

    return <></>

    //eslint-disable-next-line
  }, [
    loaded,
    userState.registrationState?.kycStatus,
    userState.registrationState?.processCompleted,
  ])

  // CLEAN-UP
  useEffect(() => {
    (async () => {
      try {
        dispatch(updateModalState({
          loading: true,
          loadingType: true,
        }))
        const {
          processCompleted,
          chosenCurrency,
          amountToSpend,
          nftTiers,
          currencyRate,
          currencyRateFetchedAt,
          kycStatus: fetchedStatus
        } = await getFlowStatus(userState.address!)
        cleanUp()
        if (sanitizeKycStatus(fetchedStatus) === kycStatus.verificationSuccessful) {
          //We should be needing this only if the next step is to submit an order
          await loadRates()
        }
        setProcessCompleted(processCompleted)
        if (processCompleted) {
          //We should be needing the following only if there are no next steps
          if (chosenCurrency) {
            setPayeeWallet(CurrencyToInternalWalletMapper[chosenCurrency!])
            dispatch(updateRates({
              chosenCurrency: chosenCurrency
            }))
          }
          if (amountToSpend) {
            setAmountToSpend(amountToSpend)
          }
          if (nftTiers) {
            setNftTiers(nftTiers)
          }
          if (currencyRateFetchedAt) {
            const timestamp = currencyRateFetchedAt
            const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
            setFetchedAt(date)
          }
          if (currencyRate) {
            setCurrencyRate(currencyRate)
          }
          if (nftTiers && currencyRates && chosenCurrency) {
            const { usdAmount } = getTotalAmounts(nftTiers, currencyRates, chosenCurrency!)
            setUsdAmount(usdAmount)
          }
        }
        setLoaded(true)
        return () => cleanUp()

      } catch (error) {
        console.error((error as Error).message)
        setLoaded(false)
        dispatch(updateModalState({
          failure: true,
          message: 'We cannot log you in at the moment. Please try again later...'
        }))

      } finally {
        setTimeout(() => {
          dispatch(updateModalState({
            loading: false,
            loadingType: false,
          }))
        }, 300)
      }
    })()
    //eslint-disable-next-line
  }, [])

  return !userState.address ? <Navigate to="/" state={{ from: location }} replace /> : (
    <Fade in={loaded} timeout={APP_DETAILS.fadeTimeOut} children={
      <Box style={styles.contentHolder}>
        <Dialog />
        {handleContent()}
      </Box>
    } />
  )
}

export default Welcome
