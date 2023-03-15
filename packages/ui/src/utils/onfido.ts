import { Currencies } from "components/FormField/types"
import { Timestamp } from "firebase/firestore"
import { NftTier } from "store/user"
import { getData } from "./firebase"

export enum kycStatus {
    unknown = 'unknown',
    verificationRejected = 'verificationRejected',
    verificationSuccessful = 'verificationSuccessful',
    submissionCompleted = 'submissionCompleted',
    submissionStarted = 'submissionStarted',
    submissionResumed = 'submissionResumed',
    submissionUserTerminated = 'submissionUserTerminated',
    submissionErrorTerminated = 'submissionErrorTerminated'
}

export const sanitizeKycStatus = (rawStatus: string): kycStatus | undefined => {
    if (!rawStatus) {
        return
    }
    if (kycStatus[rawStatus]) {
        return rawStatus as kycStatus
    }
    switch (rawStatus) {
        case 'declined':
            return kycStatus.verificationRejected
        case 'error':
            return kycStatus.submissionErrorTerminated
        case 'approved':
            return kycStatus.verificationSuccessful
        default:
            return kycStatus.unknown
    }
}
export const kycStatusMapper = (status: string | undefined) => {
    if (!status) {
        return 'Not started'
    }

    switch (status) {
        case kycStatus.submissionCompleted:
            return 'In review'

        case kycStatus.submissionResumed:
        case kycStatus.submissionStarted:
            return 'In progress'

        case kycStatus.submissionUserTerminated:
            return 'Paused'

        case kycStatus.submissionErrorTerminated:
            return 'Error'

        case kycStatus.verificationRejected:
            return 'Rejected'

        case kycStatus.verificationSuccessful:
            return 'Completed'

        default:
            return status
    }
}

export const getFlowStatus = async (address: string):
    Promise<{
        applicandId: string,
        workflowId: string,
        kycStatus: kycStatus,
        processCompleted: boolean,
        email: string,
        firstName: string,
        lastName: string,
        chosenCurrency: Currencies,
        amountToSpend: string,
        nftTiers: Record<string, NftTier>,
        currencyRate: number,
        currencyRateFetchedAt: Timestamp,
    }> => {
    const data = await getData(address)
    return {
        applicandId: data.kycApplicantId,
        workflowId: data.kycWorkflowRunId,
        kycStatus: data.kycStatus,
        processCompleted: data.processCompleted,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        chosenCurrency: data.chosenCurrency,
        amountToSpend: data.amountToSpend,
        nftTiers: data.nftTiers,
        currencyRate: data.currencyRate,
        currencyRateFetchedAt: data.currencyRateFetchedAt
    }
}
