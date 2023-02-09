import Failure from './Failure'
import Loading from './Loading'
import Success from './Success'
import { RootState } from 'store'
import { useSelector } from 'react-redux'

const Dialog = () => {

    const {
        success,
        loading,
        failure
    } = useSelector((state: RootState) => state.modalState)

    switch (true) {
        case failure:
            return <Failure />
        case loading:
            return <Loading />
        case success:
            return <Success />
        default:
            return <div></div>
    }
}

export default Dialog
