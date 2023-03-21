import express, { Response } from "express";
import cors from "cors";
import compression from "compression";
import { ApplicantRequest, AuthRequest, LoginRequest, WorkflowRunRequest, NftDeductRequest } from './types';
import { Onfido, Region } from "@onfido/api";
import * as firebaseadmin from "firebase-admin";
import { CONFIG, initializeNftCollection } from "./helpers";

const onfido = new Onfido({
    apiToken: CONFIG.ONFIDO_API_TOKEN,
    region: Region[CONFIG.ONFIDO_REGION],
});

// https://firebase.google.com/docs/admin/setup#initialize_the_sdk_in_non-google_environments
var serviceAccount = require(CONFIG.FIREBASE_SERVICE_KEY_PATH);
const firebase = firebaseadmin.initializeApp({
    credential: firebaseadmin.credential.cert(serviceAccount)
});

const app = express();
app.use(cors());
app.use(express.json());
app.use(compression());

function requireApiKey(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey || apiKey !== CONFIG.API_KEY) {
        return res.status(401).send('Unauthorized');
    }
    next();
}
app.use(requireApiKey);

app.listen(CONFIG.PORT, async () => {
    await initializeNftCollection();
    console.log(`cudos-kyc-poc-server listening on port ${CONFIG.PORT}`);
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
        const balanceUSD = amount < CONFIG.ONFIDO_LIGHT_CHECK_AMOUNT_USD ? CONFIG.ONFIDO_LIGHT_CHECK_AMOUNT_USD : CONFIG.ONFIDO_LIGHT_CHECK_AMOUNT_USD + 1
        const workflowRun = await onfido.workflowRun.create({
            applicantId: req.body.applicantId,
            workflowId: CONFIG.ONFIDO_WORKFLOW_ID,
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
            case 'approved':
                dataToSaveToDb['kycStatus'] = currentStatus
                break

            default:
                break;
        }

        if (!!dataToSaveToDb['kycStatus']) {
            await firebase.firestore().collection(CONFIG.COLLECTION).doc(userAddress).set({ ...dataToSaveToDb }, { merge: true });
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
        const tiersDoc = await firebase.firestore().collection(CONFIG.NFTS_COLLECTION.NAME).doc(CONFIG.NFTS_COLLECTION.DOCUMENTS.tiers).get();
        const limitDoc = await firebase.firestore().collection(CONFIG.NFTS_COLLECTION.NAME).doc(CONFIG.NFTS_COLLECTION.DOCUMENTS.limit).get();
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

        await firebase.firestore().collection(CONFIG.NFTS_COLLECTION.NAME).doc(CONFIG.NFTS_COLLECTION.DOCUMENTS.tiers).set(tiersFromDb);
        res.status(200).json('success');
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});
