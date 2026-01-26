import { signInAnonymously } from "firebase/auth";
import { auth } from "../firebase";

export default function SignInAnonymous() {
  async function signIn() {
    await signInAnonymously(auth);
  }

  return (
    <div>
      <h2>Continue without an account</h2>
      <button onClick={signIn}>Continue anonymously</button>
    </div>
  );
}
