import { ApplicantRequest as OnfidoApplicantRequest, SdkTokenRequest } from "@onfido/api";
import { Request } from "express";

export interface ApplicantRequest extends Request {
    body: OnfidoApplicantRequest;
}

export interface AuthRequest extends Request {
    body: SdkTokenRequest;
}
