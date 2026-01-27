import { useEffect, useState } from "react"
import { auth } from "./firebase"
import type { User } from "firebase/auth"
import { onAuthStateChanged } from "firebase/auth"
import LoadingSpinner from "./components/LoadingSpinner"
import SignInAnonymous from "./components/SignInAnonymous"
import Dashboard from "./pages/Dashboard"
import SignInPassword from "./components/SignInPassword"

export default function App() {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    // Triggers sign-in on auth changes
    return onAuthStateChanged(auth, setUser);
  }, [])

  if (user === undefined) return <LoadingSpinner />;

  return user ? <Dashboard /> : <SignInAnonymous />;
}
