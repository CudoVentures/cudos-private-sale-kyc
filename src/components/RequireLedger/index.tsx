import { Navigate, useLocation, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { RootState } from 'store'
import { LEDGERS } from 'utils/constants'
import { isValidCudosAddress } from 'components/FormField/validation'

const RequireLedger = () => {
  const userState = useSelector((state: RootState) => state.userState)
  const validLedgers = [LEDGERS.KEPLR, LEDGERS.COSMOSTATION]
  const location = useLocation()

  return isValidCudosAddress(userState.registrationState?.connectedAddress!) && validLedgers.includes(userState.connectedLedger!) ? (
    <Outlet />
  ) : (
    <Navigate to="/" state={{ from: location }} replace />
  )
}

export default RequireLedger
