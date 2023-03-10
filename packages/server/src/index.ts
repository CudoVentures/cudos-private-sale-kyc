import express, { Response } from "express";
import cors from "cors";
import compression from "compression";
import * as dotenv from "dotenv";
import { ApplicantRequest, AuthRequest, LoginRequest, WorkflowRunRequest, NftDeductRequest } from './types';
import { Onfido, Region } from "@onfido/api";
import * as firebaseadmin from "firebase-admin";

dotenv.config();
const PORT = process.env.PORT || 8881;
const ONFIDO_API_TOKEN = process.env.ONFIDO_API_TOKEN || "";
const ONFIDO_REGION = process.env.ONFIDO_REGION || "EU";
const ONFIDO_WORKFLOW_ID = process.env.ONFIDO_WORKFLOW_ID || "";
const FIREBASE_SERVICE_KEY_PATH = process.env.FIREBASE_SERVICE_KEY_PATH || "";
const ONFIDO_LIGHT_CHECK_AMOUNT_USD = 1000;

const onfido = new Onfido({
    apiToken: ONFIDO_API_TOKEN,
    region: Region[ONFIDO_REGION],
});

// https://firebase.google.com/docs/admin/setup#initialize_the_sdk_in_non-google_environments
var serviceAccount = require(FIREBASE_SERVICE_KEY_PATH);
const firebase = firebaseadmin.initializeApp({
    credential: firebaseadmin.credential.cert(serviceAccount)
});

const app = express();
app.use(cors());
app.use(express.json());
app.use(compression());

app.listen(PORT, () => {
    console.log(`cudos-kyc-poc-server listening on port ${PORT}`);
});

app.post("/login", async (req: LoginRequest, res: Response) => {
    try {
        const token = await onfido.sdkToken.generate({
            applicantId: req.body.applicantId,
            referrer: req.headers.referer,
        });
        res.status(200).json({ token: token });
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

app.post("/register-applicant", async (req: ApplicantRequest, res: Response) => {
    try {
        const applicant = await onfido.applicant.create(req.body);
        const token = await onfido.sdkToken.generate({
            applicantId: applicant.id,
            referrer: req.headers.referer,
        });
        res.status(200).json({ token: token, applicantId: applicant.id });
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

app.post("/authenticate", async (req: AuthRequest, res: Response) => {
    try {
        const token = await onfido.sdkToken.generate(req.body);
        res.status(200).json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

app.post("/create-workflow-run", async (req: WorkflowRunRequest, res: Response) => {
    try {
        const { amount, address } = req.body
        const balanceUSD = amount < ONFIDO_LIGHT_CHECK_AMOUNT_USD ? ONFIDO_LIGHT_CHECK_AMOUNT_USD : ONFIDO_LIGHT_CHECK_AMOUNT_USD + 1
        const workflowRun = await onfido.workflowRun.create({
            applicantId: req.body.applicantId,
            workflowId: ONFIDO_WORKFLOW_ID,
            customData: {
                address: address,
                balance: balanceUSD
            },
        });
        return res.status(200).json(workflowRun);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

app.get("/workflow/:userAddress/:workflowRunId/status", async (req, res) => {
    try {
        const userAddress = req.params.userAddress;
        const workflowRunId = req.params.workflowRunId;
        const run = await onfido.workflowRun.find(workflowRunId);
        const applicant = await onfido.applicant.find(run.applicantId)
        if (!run) {
            return res.status(404).json({ error: "Workflow not found" });
        }
        if (!applicant) {
            return res.status(404).json({ error: "Applicant not found" });
        }

        let currentStatus = run.status
        const dataToSaveToDb = {}
        switch (currentStatus) {
            case 'error':
            case 'declined':
                dataToSaveToDb['kycStatus'] = currentStatus
                break

            case 'completed':
                dataToSaveToDb['firstName'] = applicant.firstName
                dataToSaveToDb['lastName'] = applicant.lastName
                dataToSaveToDb['email'] = applicant.email
                dataToSaveToDb['kycStatus'] = currentStatus
                break

            default:
                break;
        }

        if (!!dataToSaveToDb['kycStatus']) {
            await firebase.firestore().collection("cudos-kyc-presale").doc(userAddress).set({ ...dataToSaveToDb }, { merge: true });
            res.status(200).json({ status: dataToSaveToDb['kycStatus'] });
        } else {
            res.status(204).json({ error: "No suitable status" })
        }

    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

app.post("/deduct-nfts", async (req: NftDeductRequest, res: Response) => {
    try {
        const tiersDoc = await firebase.firestore().collection("cudos-kyc-presale-nfts").doc("tiers").get();
        const limitDoc = await firebase.firestore().collection("cudos-kyc-presale-nfts").doc("limit").get();
        const limit = limitDoc.data()?.total as number

        const tiersFromDb = tiersDoc.data()!;
        const tiersFromRequest = req.body

        if (req.body.nftCount > limit) {
            throw new Error("invalid nft count");
        }

        for (const [userTier, { qty }] of Object.entries(tiersFromRequest.nftTiers)) {
            let customTier = userTier
            if (customTier === 'Blue Diamond') {
                customTier = 'BlueDiamond'
            }

            if (
                tiersFromDb[customTier] &&
                tiersFromDb[customTier] >= qty
            ) {
                tiersFromDb[customTier] -= qty
            } else {
                res.status(500).json({ msg: `${userTier} does not exist` });
                return;
            }
        }

        await firebase.firestore().collection("cudos-kyc-presale-nfts").doc("tiers").set(tiersFromDb);

    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});