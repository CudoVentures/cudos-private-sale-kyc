import { ApplicantRequest as OnfidoApplicantRequest, CheckRequest, SdkTokenRequest } from "@onfido/api";
import { Request } from "express";

export interface ApplicantRequest extends Request {
    body: OnfidoApplicantRequest;
}

export interface AuthRequest extends Request {
    body: SdkTokenRequest;
}

export interface CreateCheckRequest extends Request {
    body: CheckRequest;
}
