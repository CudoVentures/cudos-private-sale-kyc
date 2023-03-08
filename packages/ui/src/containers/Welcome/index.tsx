import { Box, Fade } from '@mui/material'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Dialog from 'components/Dialog'
import { Currencies } from 'components/FormField/types'
import { RootState } from 'store'
import { initialRegistrationState, updateUser } from 'store/user'

import { styles } from './styles'
import { APP_DETAILS } from 'utils/constants'
import { Navigate, useLocation } from 'react-router-dom'
import getCurrencyRates from 'api/calls'
import { updateRates } from 'store/rates'
import Pricelist from 'components/Pricelist'
import CompletedProcess from 'components/CompletedProcess'
import SaleForm from 'components/SaleForm'
import { kycStatus } from 'utils/onfido'

const Welcome = () => {

  const location = useLocation()
  const dispatch = useDispatch()
  const userState = useSelector((state: RootState) => state.userState)

  const [loaded, setLoaded] = useState<boolean>(false)

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
        kycStatus: userState.registrationState?.kycStatus || '',
        processCompleted: userState.registrationState?.processCompleted || false
      }
    }))
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
        {userState.registrationState?.processCompleted ?
          <CompletedProcess />
          :
          !userState.registrationState?.kycStatus ||
            userState.registrationState?.kycStatus !== kycStatus.verificationSuccessful ?
            <Box gap={5} display={'flex'} flexDirection={'column'} width={'350px'} alignItems={'center'}>
              <Pricelist />
            </Box>
            :
            <SaleForm />}
      </Box>
    } />
  )
}

export default Welcome
