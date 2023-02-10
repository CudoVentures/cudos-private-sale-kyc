import { Box, Button, Typography } from '@mui/material'
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

const Welcome = () => {

  const dispatch = useDispatch()
  const userState = useSelector((state: RootState) => state.userState)



  const handleSubmit = () => {
    const collectedData: PrivateSaleFields = {
      ...userState.registrationState!,
      amountToSpend: sanitizeString(userState.registrationState?.amountToSpend!),
      nftCount: sanitizeString(userState.registrationState?.nftCount!)
    }
    //TODO: Implement Onfido below
    dispatch(updateModalState({
      success: true,
      message: <Box>
        {Object.entries(collectedData).map(([key, value], idx) => {
          return (<Box key={idx} gap={3} display='flex'>
            <Typography fontWeight={900} color={'white'}>{key}:</Typography>
            <Typography>{value}</Typography>
          </Box>)
        })}
      </Box>
    }))
  }

  // CLEAN-UP
  useEffect(() => {
    const cleanUp = () => {
      dispatch(updateUser({
        registrationState: {
          ...initialRegistrationState,
          connectedAddress: userState.address || ''
        }
      }))
    }
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
