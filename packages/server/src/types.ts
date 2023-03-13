import { ApplicantRequest as OnfidoApplicantRequest, CheckRequest, SdkTokenRequest } from "@onfido/api";
import { Request } from "express";

export interface ApplicantRequest extends Request {
    body: OnfidoApplicantRequest;
}

export interface LoginRequest extends Request {
    body: {
        applicantId: string;
    };
}

export interface AuthRequest extends Request {
    body: SdkTokenRequest;
}

export interface WorkflowRunRequest extends Request {
    body: {
        applicantId: string,
        address: string,
        amount: number
    }
}
export interface NftDeductRequest extends Request {
    body: {
        nftTiers: Record<string, { qty: number, cost: number }>
        nftCount: number
    }
}
