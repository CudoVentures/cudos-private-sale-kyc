import { Box, Button, Fade } from '@mui/material'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Dialog from 'components/Dialog'
import CreationField from 'components/FormField'
import { FormField } from 'components/FormField/types'
import { isValidSubmit, sanitizeString } from 'components/FormField/validation'
import { RootState } from 'store'
import { initialRegistrationState, PrivateSaleFields, updateUser } from 'store/user'

import { styles } from './styles'
import { updateModalState } from 'store/modals'
import { authenticateWithFirebase, saveData } from 'utils/firebase'
import { APP_DETAILS, CHAIN_DETAILS } from 'utils/constants'
import { Navigate, useLocation } from 'react-router-dom'

const Welcome = () => {

  const location = useLocation()
  const dispatch = useDispatch()
  const userState = useSelector((state: RootState) => state.userState)
  const [loaded, setLoaded] = useState<boolean>(false)

  const cleanUp = () => {
    dispatch(updateUser({
      registrationState: {
        ...initialRegistrationState,
        connectedAddress: userState.address || ''
      }
    }))
  }

  const handleSubmit = async () => {
    const collectedData: PrivateSaleFields = {
      ...userState.registrationState!,
      amountToSpend: `USD ${userState.registrationState?.amountToSpend!}.00`,
      nftCount: sanitizeString(userState.registrationState?.nftCount!)
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
      await saveData(userState.registrationState?.connectedAddress!, collectedData)

      //TODO: Implement Onfido here

      dispatch(updateModalState({
        loading: false,
        loadingType: false,
        success: true,
        message: "Entry submitted",
        data: collectedData
      }))
      cleanUp()

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
    setLoaded(true)
    cleanUp()
    return () => cleanUp()
    //eslint-disable-next-line
  }, [])

  return !userState.address ? <Navigate to="/" state={{ from: location }} replace /> : (
    <Fade in={loaded} timeout={APP_DETAILS.fadeTimeOut}>
      <Box style={styles.contentHolder}>
        <Dialog />
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
            type={FormField.amountToSpend}
            text={'Amount to be spend'}
          />
          <CreationField
            type={FormField.email}
            text={'Email'}
            placeholder={'john@doe.com'}
          />
          <CreationField
            type={FormField.nftCount}
            text={'NFT Count'}
            placeholder={'The number of NFTs to be purchased'}
          />
          <CreationField
            type={FormField.externalWallet}
            text={'External Wallet Address'}
            placeholder={'The address you will be paying from'}
          />
          <Button
            disabled={!isValidSubmit(userState.registrationState)}
            variant="contained"
            onClick={handleSubmit}
            sx={styles.submitBtn}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </Fade>
  )
}

export default Welcome
