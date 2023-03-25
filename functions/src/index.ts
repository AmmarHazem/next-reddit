import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

export const createUserDocument = functions.auth.user().onCreate(async (user) => {
  try {
    const jsonUser = JSON.stringify(user);
    db.collection("users").doc(user.uid).set(JSON.parse(jsonUser));
  } catch (e) {
    console.log("--- error createUserDocument");
    console.log(e);
  }
});
