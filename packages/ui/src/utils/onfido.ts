import { getData } from "./firebase"

export enum kycStatus {
    verificationSuccessful = 'verificationSuccessful',
    submissionCompleted = 'submissionCompleted',
    submissionStarted = 'submissionStarted',
    submissionResumed = 'submissionResumed',
    submissionUserTerminated = 'submissionUserTerminated',
    submissionErrorTerminated = 'submissionErrorTerminated'
}

export const kycStatusMapper = (status: string | undefined) => {
    if (!status) {
        return 'Not started'
    }

    switch (status) {
        case kycStatus.submissionCompleted:
            return 'Submitted'

        case kycStatus.submissionResumed:
        case kycStatus.submissionStarted:
            return 'Started'

        case kycStatus.submissionUserTerminated:
            return 'Paused'

        case kycStatus.submissionErrorTerminated:
            return 'Error'

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
        kycStatus: kycStatus
    }> => {
    const data = await getData(address)
    return {
        applicandId: data.kycApplicantId,
        workflowId: data.kycWorkflowRunId,
        kycToken: data.kycToken,
        kycStatus: data.kycStatus
    }
}
