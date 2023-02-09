import { Box, Tooltip } from '@mui/material'
import { RootState } from 'store'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { updateUser } from 'store/user'
import { cutFractions, handleBalanceToFullBalance } from 'utils/regexFormatting'
import { DENOM_TO_ALIAS, DENOM_TO_ICON } from 'utils/constants'
import unknownLogoIcon from 'assets/vectors/questionmark-icon.svg'
import ChangeCircleOutlinedIcon from '@mui/icons-material/ChangeCircleOutlined'
import { updateModalState } from 'store/modals'

import { 
  checkForAdminToken, 
  getAccountBalances, 
  getNativeBalance, 
  updateChosenBalance 
} from 'utils/helpers'

const AccountBalance = (): JSX.Element => {

  const {
    address,
    balances,
    chosenNetwork,
    chosenBalance
  } = useSelector((state: RootState) => state.userState)

  const fullBalance = handleBalanceToFullBalance(chosenBalance!)
  const displayBalance = cutFractions(fullBalance)
  const displayName = DENOM_TO_ALIAS[chosenBalance?.denom!] || chosenBalance?.denom!
  const displayLogo = DENOM_TO_ICON[chosenBalance?.denom!] || unknownLogoIcon

  const dispatch = useDispatch()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentBalances = await getAccountBalances(chosenNetwork!, address!)
        const userNativeBalance = getNativeBalance(currentBalances)
        const isAdmin = checkForAdminToken(currentBalances)
        const updatedChosenBalance = updateChosenBalance(currentBalances, chosenBalance!)

        dispatch(updateUser({
          balances: currentBalances,
          isAdmin: isAdmin,
          nativeBalance: userNativeBalance,
          chosenBalance: updatedChosenBalance
        }))

      } catch (error) {
        console.error((error as Error).message)
      }
    }

    const timer = setInterval(async () => {
      await fetchData()
    }, 15000)

    return () => {
      clearInterval(timer)
    }
    //eslint-disable-next-line
  }, [chosenBalance])

  const handleChangeToken = () => {
    dispatch(updateModalState({ changeChosenBalance: true }))
  }

  return (
    <Box display={'flex'} alignItems={'center'}>
      <Tooltip title={`${fullBalance} ${displayName}`}>
        <Box display={'flex'} alignItems={'center'}>
          <img src={displayLogo} alt="Token logo" />
          <span style={{ margin: '0 5px 0 10px' }}>{displayBalance}</span>
          <span>{displayName}</span>
        </Box>
      </Tooltip>
      {
        balances!.length > 1 ?
          <Tooltip style={{ cursor: 'pointer' }} onClick={handleChangeToken} title={'Change token'}>
            <ChangeCircleOutlinedIcon
              sx={{ margin: '0px -10px 2px 0px', height: '18px' }}
              color='primary' />
          </Tooltip> : null
      }
    </Box>
  )
}

export default AccountBalance
