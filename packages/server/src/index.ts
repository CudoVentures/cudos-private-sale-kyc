import express, { Response } from "express";
import cors from "cors";
import compression from "compression";
import * as dotenv from "dotenv";
import { ApplicantRequest, AuthRequest } from "./types";
import { Onfido, Region } from "@onfido/api";

dotenv.config();
const PORT = process.env.PORT || 8881;
const ONFIDO_API_TOKEN = process.env.ONFIDO_API_TOKEN || "";
const ONFIDO_REGION = process.env.ONFIDO_REGION || "EU";

const onfido = new Onfido({
    apiToken: ONFIDO_API_TOKEN,
    region: Region[ONFIDO_REGION],
});

const app = express();
app.use(cors());
app.use(express.json());
app.use(compression());

app.listen(PORT, () => {
    console.log(`cudos-kyc-poc-server listening on port ${PORT}`);
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
