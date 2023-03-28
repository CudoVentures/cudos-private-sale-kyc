import { Box, Button, Tooltip, Typography } from "@mui/material"
import * as Onfido from 'onfido-sdk-ui'
import CachedIcon from '@mui/icons-material/Cached';
import { COLORS_DARK_THEME } from "theme/colors"
import { kycStatus, kycStatusMapper } from "utils/onfido"
import { DocumentData, Timestamp } from "firebase/firestore";
import customAxios from "api/axios";
import { useDispatch, useSelector } from "react-redux";
import { updateModalState } from "store/modals";
import { initialRegistrationState, updateUser, userState } from "store/user";
import { authenticateWithFirebase, deleteEverythingButNonce, saveData } from "utils/firebase";
import { RootState } from "store";
import { CHAIN_DETAILS } from "utils/constants";
import { styles } from "./styles";

const StatusStarter = ({
    status,
    text,
    customWidth,
    outlined
}: {
    status: string | undefined,
    text?: string
    customWidth?: string
    outlined?: boolean
}) => {

    const dispatch = useDispatch()
    const userState = useSelector((state: RootState) => state.userState)

    const setOnfidoModalOpen = (state: boolean) => {
        dispatch(updateModalState({ onfidoModalOpen: state }))
    }

    const runOnfido = async (token: string, workflowRunId: string) => {
        setOnfidoModalOpen(true)
        const onfido = Onfido.init({
            token: token,
            useModal: true,
            isModalOpen: true,
            shouldCloseOnOverlayClick: false,
            region: 'US',
            steps: ['welcome', 'document'],
            workflowRunId: workflowRunId,
            onModalRequestClose: function () {
                onfido.setOptions({ isModalOpen: false })
                dispatch(updateModalState({
                    failure: true,
                    message: 'KYC not completed'
                }))
                saveData(
                    userState.address!,
                    { kycStatus: kycStatus.submissionUserTerminated }
                )
                onfido.tearDown()
                setOnfidoModalOpen(false)
            },
            onError: function (error) {
                console.error(error.message)
                dispatch(updateModalState({
                    failure: true,
                    message: 'KYC not completed'
                }))
                saveData(
                    userState.address!,
                    {
                        kycStatus: kycStatus.submissionErrorTerminated,
                        kycError: error.message
                    }
                )
                onfido.tearDown()
                setOnfidoModalOpen(false)
            },
            onUserExit: function () {
                dispatch(updateModalState({
                    failure: true,
                    message: 'KYC not completed'
                }))
                saveData(
                    userState.address!,
                    { kycStatus: kycStatus.submissionUserTerminated }
                )
                onfido.tearDown()
                setOnfidoModalOpen(false)
            },

            onComplete: async function (data) {
                onfido.setOptions({ isModalOpen: false })
                dispatch(updateModalState({
                    success: true,
                    message: "Documents successfully submitted"
                }))
                await saveData(
                    userState.address!,
                    { kycStatus: kycStatus.submissionCompleted }
                )
                dispatch(updateUser({
                    registrationState: {
                        ...userState.registrationState!,
                        kycStatus: kycStatus.submissionCompleted
                    }
                }))

                onfido.tearDown()
                setOnfidoModalOpen(false)
            }
        })
    }

    const restartOnfido = async () => {
        dispatch(updateModalState({
            loading: true,
            loadingType: true,
        }))
        const { success } = await authenticateWithFirebase(
            userState.address!,
            CHAIN_DETAILS.FIREBASE.COLLECTION,
            userState.connectedLedger!
        )
        if (!success) {
            throw new Error('Failed to authenticate with Firebase')
        }
        await deleteEverythingButNonce(userState.address!!)
        const updatedUser = {
            ...userState,
            registrationState: {
                ...initialRegistrationState
            }
        }
        dispatch(updateUser(updatedUser as userState))
        dispatch(updateModalState({
            loading: false,
            loadingType: false,
        }))
    }

    const resumeOnfido = async () => {
        if (!userState.registrationState?.kycApplicantId || !userState.registrationState.kycWorkflowRunId) {
            await startOnfido()
            return
        }
        const tokenResponse = await customAxios.post(
            CHAIN_DETAILS.KYC_GET_RESUME_FLOW_TOKEN_URL,
            { applicantId: userState.registrationState?.kycApplicantId }
        )
        const resumedData: DocumentData = {
            kycStatus: kycStatus.submissionResumed,
            resumedAt: Timestamp.now().toDate()
        }
        await saveData(userState.address!, resumedData)
        await runOnfido(tokenResponse.data.token, userState.registrationState.kycWorkflowRunId)
    }

    const startOnfido = async () => {
        dispatch(updateModalState({
            loading: true,
            loadingType: true,
        }))
        const kycRegisterRes = await customAxios.post(
            CHAIN_DETAILS.KYC_REGISTER_APPLICANT_URL,
            { firstName: 'default', lastName: 'default' }
        )
        const kycWorkflowRunRes = await customAxios.post(
            CHAIN_DETAILS.KYC_CREATE_WORKFLOW_RUN_URL,
            {
                applicantId: kycRegisterRes.data.applicantId,
                address: userState.address,
                amount: 1275
            }
        )
        const workflowId = kycWorkflowRunRes.data.id as string
        const initialData: DocumentData = {
            kycStatus: kycStatus.submissionStarted,
            kycError: '',
            kycApplicantId: kycRegisterRes.data.applicantId as string,
            kycWorkflowRunId: workflowId,
            kycStartedAt: Timestamp.now().toDate()
        }
        await saveData(userState.address!, initialData)
        dispatch(updateModalState({
            loading: false,
            loadingType: false,
        }))
        await runOnfido(kycRegisterRes.data.token, workflowId)
    }

    return (
        <Box gap={2} display='flex' alignItems={'center'} width={customWidth ? customWidth : 'max-content'}>
            {text ?
                <Typography>
                    {text}
                </Typography> : null}
            {status ?
                <Typography
                    color={
                        status === kycStatus.submissionCompleted ||
                            status === kycStatus.submissionUserTerminated ?
                            COLORS_DARK_THEME.TESTNET_ORANGE :
                            status === kycStatus.verificationSuccessful ?
                                COLORS_DARK_THEME.VERIFIED_GREEN :
                                status === kycStatus.verificationRejected ||
                                    status === kycStatus.submissionErrorTerminated ?
                                    COLORS_DARK_THEME.REJECTED_RED :
                                    'text.secondary'
                    }
                >
                    {kycStatusMapper(userState.registrationState!.kycStatus)}
                </Typography> : null}
            {(status !== kycStatus.verificationSuccessful &&
                status !== kycStatus.submissionCompleted &&
                status !== kycStatus.unknown) ?
                !status ?
                    <Button
                        sx={{ ...styles.btn, width: customWidth ? customWidth : '160px' }}
                        variant={outlined ? 'outlined' : "contained"}
                        onClick={startOnfido}
                    >
                        Verify
                    </Button>
                    :
                    <Box gap={1} display={'flex'}>
                        {status === kycStatus.verificationRejected ? null :
                            <Button
                                sx={{ ...styles.btn, width: customWidth ? customWidth : '160px' }}
                                variant={outlined ? 'outlined' : "contained"}
                                onClick={resumeOnfido}
                            >
                                Resume
                            </Button>}
                        <Tooltip title='Restart verification process'>
                            <Button
                                sx={styles.btn}
                                variant={outlined ? 'outlined' : "contained"}
                                onClick={restartOnfido}
                            >
                                <CachedIcon sx={{ width: '20px' }} />
                            </Button>
                        </Tooltip>
                    </Box>
                : null}
        </Box>
    )
}

export default StatusStarter
