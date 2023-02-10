import { Box, Button } from '@mui/material'
import { useEffect } from 'react'
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
import { CHAIN_DETAILS } from 'utils/constants'

const Welcome = () => {

  const dispatch = useDispatch()
  const userState = useSelector((state: RootState) => state.userState)

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
        message: "Entry submitted"
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
    cleanUp()
    return () => cleanUp()
    //eslint-disable-next-line
  }, [])

  return (
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
          placeholder={'What is this?'}
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
  )
}

export default Welcome
