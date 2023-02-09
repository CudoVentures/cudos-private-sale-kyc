import { Navigate, useLocation, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from 'store'
import { isValidCudosAddress } from 'utils/validation'
import { LEDGERS } from 'utils/constants'

const RequireLedger = () => {
  const { address, connectedLedger } = useSelector((state: RootState) => state.userState)
  const validLedgers = [LEDGERS.KEPLR, LEDGERS.COSMOSTATION]
  const location = useLocation()

  return isValidCudosAddress(address!) && validLedgers.includes(connectedLedger!) ? (
    <Outlet />
  ) : (
    <Navigate to="/" state={{ from: location }} replace />
  )
}

export default RequireLedger
