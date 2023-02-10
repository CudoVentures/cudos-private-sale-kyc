import { CHAIN_DETAILS } from "./constants";
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCustomToken } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore/lite';
import axios from "axios";
import { PrivateSaleFields } from "store/user";
import { signArbitrary } from "./helpers";
import { SUPPORTED_WALLET } from "cudosjs";

const firebaseConfig = {
    apiKey: CHAIN_DETAILS.FIREBASE.API_KEY,
    authDomain: CHAIN_DETAILS.FIREBASE.DOMAIN,
    projectId: CHAIN_DETAILS.FIREBASE.PROJECT_ID
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
export const auth = getAuth(app);

export const authenticateWithFirebase = async (address: string, collection: string, walletType: SUPPORTED_WALLET): Promise<{ success: boolean }> => {
    try {
        const firebaseToken = await authenticate(address, collection, walletType)
        await signInWithCustomToken(auth, firebaseToken!)
        return { success: true }
    } catch {
        return { success: false }
    }
}

export const authenticate = async (address: string, collection: string, connectedWallet: SUPPORTED_WALLET) => {
    try {
        const nonceRes = await axios.post(CHAIN_DETAILS.FIREBASE.AUTH_NONCE_URL, { address, collection });
        const { signature } = await signArbitrary(connectedWallet, address, nonceRes.data.nonce);
        const verifyRes = await axios.post(CHAIN_DETAILS.FIREBASE.AUTH_VERIFY_URL, { address, signature, collection });
        return verifyRes.data.token;
    } catch (error) {
        throw new Error("Firebase authentication error")
    }
}

export const saveData = async (address: string, data: PrivateSaleFields): Promise<void> => {
    try {
        const dataDoc = doc(firestore, CHAIN_DETAILS.FIREBASE.COLLECTION, address);
        return setDoc(dataDoc, { data });
    } catch {
        throw new Error("Error while saving data to Firebase")
    }
};

const getData = async (address: string): Promise<any> => {
    try {
        const data = await getDoc(doc(firestore, CHAIN_DETAILS.FIREBASE.COLLECTION, address));
        return data.data() || {}
    } catch {
        throw new Error("Error while getting data from Firebase")
    }
};