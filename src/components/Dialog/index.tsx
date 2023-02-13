import Failure from './Failure'
import Loading from './Loading'
import Success from './Success'
import { RootState } from 'store'
import { useSelector } from 'react-redux'
import WalletSelector from './WalletSelector'

const Dialog = () => {

    const {
        success,
        loading,
        failure,
        selectWallet
    } = useSelector((state: RootState) => state.modalState)

    switch (true) {
        case failure:
            return <Failure />
        case loading:
            return <Loading />
        case success:
            return <Success />
        case selectWallet:
            return <WalletSelector />
        default:
            return <div></div>
    }
}

export default Dialog
