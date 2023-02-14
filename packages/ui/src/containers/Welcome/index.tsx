import { Box, Button, Divider, Fade, Tooltip, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Dialog from 'components/Dialog'
import CreationField from 'components/FormField'
import { FormField } from 'components/FormField/types'
import { isValidSubmit } from 'components/FormField/validation'
import { RootState } from 'store'
import { initialRegistrationState, PrivateSaleFields, updateUser } from 'store/user'

import { styles } from './styles'
import { updateModalState } from 'store/modals'
import { authenticateWithFirebase, saveData } from 'utils/firebase'
import { APP_DETAILS, CHAIN_DETAILS } from 'utils/constants'
import { Navigate, useLocation } from 'react-router-dom'
import * as Onfido from 'onfido-sdk-ui'
import axios from 'axios'
import { COLORS_DARK_THEME } from 'theme/colors'
import { validationStyles } from 'components/FormField/styles'
import { ReactComponent as InfoIcon } from 'assets/vectors/info-icon.svg'

const Welcome = () => {

  const location = useLocation()
  const dispatch = useDispatch()
  const userState = useSelector((state: RootState) => state.userState)
  const [loaded, setLoaded] = useState<boolean>(false)
  const [totalSum, setTotalSum] = useState<number>(0)

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

      const registerRes = await axios.post(
        CHAIN_DETAILS.KYC_REGISTER_APPLICANT_URL,
        {
          firstName: collectedData.firstName,
          lastName: collectedData.lastName,
        }
      );

      collectedData.kycApplicantId = registerRes.data.applicantId as string
      await saveData(userState.registrationState?.connectedAddress!, collectedData)

      dispatch(updateModalState({
        loading: false,
        loadingType: false,
      }))

      const onfido = Onfido.init({
        token: registerRes.data.token,
        useModal: true,
        isModalOpen: true,
        region: 'US',
        steps: ['welcome', 'document'],
        onModalRequestClose: function () {
          onfido.setOptions({ isModalOpen: false })
          dispatch(updateModalState({
            failure: true,
            message: 'KYC not completed'
          }))
        },
        onComplete: function (data) {
          onfido.setOptions({ isModalOpen: false })

          collectedData.kycCompleted = true
          saveData(userState.registrationState?.connectedAddress!, collectedData)

          axios.post(
            CHAIN_DETAILS.KYC_CREATE_CHECK_URL,
            {
              applicantId: collectedData.kycApplicantId
            }
          );

          dispatch(updateModalState({
            success: true,
            message: "Entry submitted",
            data: collectedData
          }))
          cleanUp()
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

  useEffect(() => {
    let amount = 0
    Array.from(Object.values(userState.registrationState?.nftTiers!)).forEach((value) => {
      amount += (value.cost * value.qty)
    })
    setTotalSum(amount)
    dispatch(updateUser({
      registrationState: {
        ...userState.registrationState!,
        [FormField.amountToSpend]: amount.toLocaleString()
      }
    }))
    //eslint-disable-next-line
  }, [userState.registrationState?.nftTiers])

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
          {/* <CreationField
            type={FormField.amountToSpend}
            text={'Amount to be spend'}
          /> */}
          <CreationField
            type={FormField.email}
            text={'Email'}
            placeholder={'john@doe.com'}
          />
          <CreationField
            type={FormField.nftCount}
            text={'NFT Count'}
          />
          <CreationField
            type={FormField.externalWallet}
            text={'External Wallet Address'}
            placeholder={'The address you will be paying from'}
          />
          {Object.values(userState.registrationState?.nftTiers!).find((value) => value.qty > 0) ? <Box display={'flex'} width={'100%'} flexDirection={'row'} justifyContent={'space-between'}>
            <Typography fontWeight={900}>Amount to be paid</Typography>
            <Tooltip placement='right-end' followCursor
              PopperProps={validationStyles.tierTooltipPopper}
              componentsProps={validationStyles.tierTooltipProps}
              title={
                <Box
                  gap={2} sx={{ display: "flex", flexDirection: 'column' }}
                >
                  <Typography color={'text.primary'} fontWeight={900}>
                    {`Your selection`}
                  </Typography>
                  <Divider />
                  {Array.from(Object.entries(userState.registrationState?.nftTiers!)).map(([name, props], idx) => {
                    return props.qty <= 0 ? null : (
                      <Box gap={2} key={idx} display='flex' justifyContent={'space-between'} >
                        <Typography color={'text.primary'} fontWeight={900}>
                          {name}
                        </Typography>
                        <Typography fontWeight={900}>
                          {`${props.qty} x ${props.cost}`}
                        </Typography>
                      </Box>
                    )
                  })}
                  <Typography alignSelf={'flex-end'} color={'text.primary'} fontWeight={900}>
                    {`Total`}
                  </Typography>
                  <Divider />
                  <Typography alignSelf={'flex-end'} fontWeight={900}>
                    ${totalSum.toLocaleString()}
                  </Typography>
                </Box>
              }>
              <Box sx={{ cursor: 'pointer' }} display={'flex'}>
                <Typography color={COLORS_DARK_THEME.PRIMARY_BLUE} fontWeight={900}>${totalSum.toLocaleString()}</Typography>
                <InfoIcon style={{ marginLeft: '10px' }} />
              </Box>
            </Tooltip>
          </Box> : null}
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
