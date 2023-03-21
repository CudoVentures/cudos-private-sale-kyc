import firebaseadmin from "firebase-admin";
import * as dotenv from "dotenv";

dotenv.config({ path: `${__dirname}/../../config/.env` });
export const CONFIG = {
  PORT: process.env.PORT || 8881,
  ONFIDO_API_TOKEN: process.env.ONFIDO_API_TOKEN || "",
  ONFIDO_REGION: process.env.ONFIDO_REGION || "EU",
  ONFIDO_WORKFLOW_ID: process.env.ONFIDO_WORKFLOW_ID || "",
  FIREBASE_SERVICE_KEY_PATH: process.env.FIREBASE_SERVICE_KEY_PATH || "",
  API_KEY: process.env.API_KEY || "",
  ONFIDO_LIGHT_CHECK_AMOUNT_USD: 1000,
  COLLECTION: process.env.VITE_APP_FIREBASE_COLLECTION || "",
  NFTS_COLLECTION: {
    NAME: (process.env.VITE_APP_FIREBASE_COLLECTION || "") + '-nfts',
    DOCUMENTS: {
      limit: 'limit',
      tiers: 'tiers'
    }
  }
}

const INITIAL_NFT_DOCUMENTS = {
  limit: {
    total: 50
  },
  tiers: {
    BlueDiamond: 6,
    Diamond: 14,
    Emerald: 147,
    Opal: 564,
    Ruby: 2200
  }
}

export const initializeNftCollection = async () => {

  try {
    const NFT_COLLECTION = CONFIG.NFTS_COLLECTION.NAME
    const collectionRef = firebaseadmin.firestore().collection(NFT_COLLECTION);
    const snapshot = await collectionRef.limit(1).get();

    if (snapshot.empty) {
      console.log(`Collection '${NFT_COLLECTION}' does not exist. Creating...`);
      await collectionRef.doc(CONFIG.NFTS_COLLECTION.DOCUMENTS.limit).set(INITIAL_NFT_DOCUMENTS.limit);
      await collectionRef.doc(CONFIG.NFTS_COLLECTION.DOCUMENTS.tiers).set(INITIAL_NFT_DOCUMENTS.tiers);
      console.log(`Collection '${NFT_COLLECTION}' successfully created`);
      return
    }

    console.log(`Collection '${NFT_COLLECTION}' exists. Checking documents integrity...`);
    const expectedDocumentKeys = Object.keys(CONFIG.NFTS_COLLECTION.DOCUMENTS);
    const actualDocuments = await Promise.all(expectedDocumentKeys.map(async documentKey => {
      const docRef = collectionRef.doc(documentKey);
      const docSnapshot = await docRef.get();
      return { key: documentKey, exists: docSnapshot.exists };
    }));

    for (const actualDocument of actualDocuments) {
      const { key, exists } = actualDocument;
      if (!exists) {
        console.log(`Document '${key}' is missing or wrong. Setting to default values...`);
        await collectionRef.doc(key).set(INITIAL_NFT_DOCUMENTS[key]);
        console.log(`Document '${key}' created successfully with default values.`);
      } else {
        console.log(`Document '${key}' already exists. Skipping.`);
      }
    }
  } catch (error) {
    console.error(`Error creating collection '${CONFIG.NFTS_COLLECTION.NAME}' and documents:`, error);
  }
}
