import Failure from './Failure'
import Loading from './Loading'
import Success from './Success'
import { RootState } from 'store'
import { useSelector } from 'react-redux'
import WalletSelector from './WalletSelector'
import TOC from './TOC'

const Dialog = () => {

    const {
        success,
        loading,
        failure,
        selectWallet,
        openTOC
    } = useSelector((state: RootState) => state.modalState)

    switch (true) {
        case openTOC:
            return <TOC />
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
