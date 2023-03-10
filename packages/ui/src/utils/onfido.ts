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
        kycToken: string,
        kycStatus: kycStatus,
        processCompleted: boolean,
        email: string,
        firstName: string,
        lastName: string
    }> => {
    const data = await getData(address)
    return {
        applicandId: data.kycApplicantId,
        workflowId: data.kycWorkflowRunId,
        kycToken: data.kycToken,
        kycStatus: data.kycStatus,
        processCompleted: data.processCompleted,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName
    }
}
