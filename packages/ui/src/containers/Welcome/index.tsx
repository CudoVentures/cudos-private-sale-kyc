import { Box, Button, Collapse, Fade } from '@mui/material'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Dialog from 'components/Dialog'
import CreationField from 'components/FormField'
import { Currencies, FormField } from 'components/FormField/types'
import { getFieldisValid, isValidSubmit } from 'components/FormField/validation'
import { RootState } from 'store'
import { initialRegistrationState, PrivateSaleFields, updateUser } from 'store/user'

import { styles } from './styles'
import { updateModalState } from 'store/modals'
import { authenticateWithFirebase, saveData } from 'utils/firebase'
import { APP_DETAILS, CHAIN_DETAILS } from 'utils/constants'
import { Navigate, useLocation } from 'react-router-dom'
import TotalInUsd from 'components/TotalInUsd'
import ConvertedAmount from 'components/ConvertedAmount'
import { DocumentData, Timestamp } from 'firebase/firestore'
import getCurrencyRates from 'api/calls'
import { updateRates } from 'store/rates'
import Pricelist from 'components/Pricelist'
import { kycStatus } from 'utils/onfido'

const Welcome = () => {

  const location = useLocation()
  const dispatch = useDispatch()
  const userState = useSelector((state: RootState) => state.userState)
  const { chosenCurrency } = useSelector((state: RootState) => state.ratesState)
  const [loaded, setLoaded] = useState<boolean>(false)
  const { isValid: validTiers } = getFieldisValid(FormField.nftTiers, userState.registrationState?.nftTiers!)

  const loadRates = async () => {
    const rates = await getCurrencyRates(Object.values(Currencies), 'USD')
    dispatch(updateRates({
      currencyRates: rates,
      fetchedAt: new Date()
    }))
  }

  const cleanUp = () => {
    dispatch(updateUser({
      registrationState: {
        ...initialRegistrationState,
        connectedAddress: userState.address || '',
        kycApplicantId: userState.registrationState?.kycApplicantId || '',
        kycWorkflowRunId: userState.registrationState?.kycWorkflowRunId || '',
        kycToken: userState.registrationState?.kycToken || '',
        kycStatus: userState.registrationState?.kycStatus || ''
      }
    }))
  }

  const handleSubmit = async () => {
    const collectedData: PrivateSaleFields = {
      ...userState.registrationState!,
      amountToSpend: userState.registrationState?.amountToSpend!,
      nftCount: Object.values(userState.registrationState?.nftTiers!).reduce((acc, { qty }) => acc + qty, 0).toString()
    }
    try {
      dispatch(updateModalState({
        loading: true,
        loadingType: true,
      }))
      const { success } = await authenticateWithFirebase(
        collectedData.connectedAddress,
        CHAIN_DETAILS.FIREBASE.COLLECTION,
        userState.connectedLedger!
      )
      if (!success) {
        throw new Error('Failed to authenticate with Firebase')
      }

      const dataForSaving: DocumentData = {
        ...collectedData,
        createdAt: Timestamp.now().toDate(),
        kycLinkToVerificationStatus: `https://dashboard.onfido.com/results/${collectedData.kycWorkflowRunId}`
      }
      dataForSaving.kycStatus = 'Onfido flow started'
      await saveData(userState.registrationState?.connectedAddress!, dataForSaving)

      dispatch(updateModalState({
        loading: false,
        loadingType: false,
      }))



    } catch (error) {
      console.error((error as Error).message)
      dispatch(updateModalState({
        loading: false,
        loadingType: false,
        failure: true,
        message: 'Something went wrong'
      }))
    }
  }

  // CLEAN-UP
  useEffect(() => {
    loadRates()
    setLoaded(true)
    cleanUp()
    return () => cleanUp()
    //eslint-disable-next-line
  }, [])

  return !userState.address ? <Navigate to="/" state={{ from: location }} replace /> : (
    <Fade in={loaded} timeout={APP_DETAILS.fadeTimeOut} children={
      <Box style={styles.contentHolder}>
        <Dialog />
        {!userState.registrationState?.kycStatus || userState.registrationState?.kycStatus !== kycStatus.verificationSuccessful ?
          <Box gap={5} display={'flex'} flexDirection={'column'} width={'350px'} alignItems={'center'}>
            <Pricelist />
          </Box>
          :
          <Box gap={4} sx={styles.formHolder}>
            <CreationField
              type={FormField.connectedAddress}
              text={'Connected Address'}
              isDisabled={true}
            />
            <CreationField
              type={FormField.firstName}
              text={'First Name'}
              placeholder={'John'}
            />
            <CreationField
              type={FormField.lastName}
              text={'Last Name'}
              placeholder={'Doe'}
            />
            <CreationField
              type={FormField.email}
              text={'Email'}
              placeholder={'john@doe.com'}
            />
            <CreationField
              type={FormField.nftTiers}
              text={'NFT Count'}
            />
            <Collapse
              sx={{ width: '100%' }}
              timeout={'auto'}
              in={validTiers}
            >
              <TotalInUsd />
              <ConvertedAmount />
              <CreationField
                type={FormField.externalWallet}
                text={'External Wallet Address'}
                placeholder={'The address you will be paying from'}
              />
            </Collapse>
            <Button
              disabled={!isValidSubmit(chosenCurrency, userState.registrationState)}
              variant="contained"
              onClick={handleSubmit}
              sx={styles.submitBtn}
            >
              Submit
            </Button>
          </Box>}
      </Box>
    } />
  )
}

export default Welcome
