import { CHAIN_DETAILS } from "./constants";
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCustomToken } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore/lite';
import axios from "axios";
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

export const saveData = async (address: string, newData: any): Promise<void> => {
    try {
        const dataDoc = doc(firestore, CHAIN_DETAILS.FIREBASE.COLLECTION, address);
        return setDoc(dataDoc, { ...newData }, { merge: true });
    } catch (error) {
        console.log(error)
        throw new Error("Error while saving data to Firebase")
    }
};

export const getData = async (address: string): Promise<any> => {
    const dataDoc = doc(firestore, CHAIN_DETAILS.FIREBASE.COLLECTION, address);
    const docSnap = await getDoc(dataDoc);
    if (docSnap.exists()) {
        return docSnap.data();
    }
    return undefined
};

export const getNftQuantities = async (): Promise<any> => {
    const dataDoc = doc(firestore, `${CHAIN_DETAILS.FIREBASE.COLLECTION}-nfts`, 'tiers');
    const docSnap = await getDoc(dataDoc);
    if (docSnap.exists()) {
        return docSnap.data();
    }
    return undefined
};

export const getNftLimit = async (): Promise<any> => {
    const dataDoc = doc(firestore, `${CHAIN_DETAILS.FIREBASE.COLLECTION}-nfts`, 'limit');
    const docSnap = await getDoc(dataDoc);
    if (docSnap.exists()) {
        return docSnap.data();
    }
    return undefined
};

export const deleteData = async (address: string, fieldsToDelete: string[]): Promise<void> => {
    try {
        const dataDoc = doc(firestore, CHAIN_DETAILS.FIREBASE.COLLECTION, address);
        const docSnap = await getDoc(dataDoc);
        if (docSnap.exists()) {
            const data = docSnap.data();
            fieldsToDelete.forEach(field => delete data[field]);
            return setDoc(dataDoc, { ...data });
        }
        return;
    } catch (error) {
        console.log(error)
        throw new Error("Error while deleting from Firebase")
    }
};
