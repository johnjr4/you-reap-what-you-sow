import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  getDocs,
  collection,
  where,
  addDoc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBLanM-xaDe7z2k_ptQlaIFWR3yjF6mab0",
  authDomain: "final-464b0.firebaseapp.com",
  projectId: "final-464b0",
  storageBucket: "final-464b0.appspot.com",
  messagingSenderId: "833723959727",
  appId: "1:833723959727:web:67443f454e1442cd7f875a",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

const googleSignIn = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    const query = query(collection(db, "users"), where("uid", "==", user.uid));
    const docs = await getDocs(query);
    if (docs.docs.length === 0) {
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
      });
    }
  } catch (err) {
    console.log("Error: Google SignIn Failed");
  }
};

const emailSignIn = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.log("Error: Email SignIn Failed");
  }
};
const emailRegister = async (name, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await addDoc(collection(db, "users"), {
      uid: user.uid,
      name,
      authProvider: "local",
      email,
    });
  } catch (err) {
    console.log("Error: Email Register Failed");
  }
};
const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (err) {
    console.log("Error: Password Reset Failed");
  }
};
const logout = () => {
  signOut(auth);
};
export {
  auth,
  db,
  googleSignIn,
  emailSignIn,
  emailRegister,
  sendPasswordReset,
  logout,
};
