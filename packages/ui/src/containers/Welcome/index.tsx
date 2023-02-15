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
import * as Onfido from 'onfido-sdk-ui'
import axios from 'axios'

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

      const kycRegisterRes = await axios.post(
        CHAIN_DETAILS.KYC_REGISTER_APPLICANT_URL,
        {
          firstName: collectedData.firstName,
          lastName: collectedData.lastName,
        }
      )
    
      const kycWorkflowRunRes = await axios.post(
        CHAIN_DETAILS.KYC_CREATE_WORKFLOW_RUN_URL,
        {
          applicantId: kycRegisterRes.data.applicantId,
          address: collectedData.connectedAddress,
          amount: Number(userState.registrationState?.amountToSpend!.replace(/,/g, ''))
        }
      )

      collectedData.kycApplicantId = kycRegisterRes.data.applicantId as string
      collectedData.kycWorkflowRunId = kycWorkflowRunRes.data.id as string
      await saveData(userState.registrationState?.connectedAddress!, collectedData)

      dispatch(updateModalState({
        loading: false,
        loadingType: false,
      }))

      const onfido = Onfido.init({
        token: kycRegisterRes.data.token,
        useModal: true,
        isModalOpen: true,
        region: 'US',
        steps: ['welcome', 'document'],
        workflowRunId: kycWorkflowRunRes.data.id,
        onModalRequestClose: function() {
          onfido.setOptions({isModalOpen: false})
          dispatch(updateModalState({
            failure: true,
            message: 'KYC not completed'
          }))
          onfido.tearDown()
        },
        onError: function(error) {
          console.error(error.message)
          dispatch(updateModalState({
            failure: true,
            message: 'KYC not completed'
          }))
          onfido.tearDown()
        },
        onUserExit: function() {
          dispatch(updateModalState({
            failure: true,
            message: 'KYC not completed'
          }))
          onfido.tearDown()
        },
        onComplete: function(data) {
          onfido.setOptions({isModalOpen: false})
          collectedData.kycCompleted = true
          saveData(userState.registrationState?.connectedAddress!, collectedData)

          dispatch(updateModalState({
            success: true,
            message: "Entry submitted",
            data: collectedData
          }))
          cleanUp()

          onfido.tearDown()
        }
      })

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
          <div id='onfido-mount'></div>
        </Box>
      </Box>
    </Fade>
  )
}

export default Welcome
