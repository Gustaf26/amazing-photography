import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import { Button, Spinner } from "react-bootstrap";

import { useMainContext } from "./MainContext";

const AuthContext = createContext();

const useAuth = () => {
  return useContext(AuthContext);
};

const AuthContextProvider = (props) => {
  const [loading, setLoading] = useState(true);
  const { setUser } = useMainContext();

  const login = (email, password) => {
    return auth.signInWithEmailAndPassword(email, password);
  };

  const logout = () => {
    setUser("");
    return auth.signOut();
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      // auth state changed (by a user either logging in or out)
      if (user) {
        setUser(user);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const contextValues = {
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValues}>
      {loading && (
        <div className="d-flex justify-content-center my-5">
          <Button variant="primary" disabled>
            <Spinner
              as="span"
              animation="grow"
              size="sm"
              role="status"
              aria-hidden="true"
            />
            Loading...
          </Button>
        </div>
      )}
      {!loading && props.children}
    </AuthContext.Provider>
  );
};

export { AuthContext, useAuth, AuthContextProvider as default };
