import { createContext, useContext, useEffect, useState } from "react";
// import { auth } from "../firebase";
import { Button, Spinner } from "react-bootstrap";

const MainContext = createContext();

const useMainContext = () => {
  return useContext(MainContext);
};

const MainContextProvider = (props) => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState("");

  const contextValues = {
    setUser,
    user,
  };

  useEffect(() => {
    if (user) {
      setLoading(false);
    }
  }, [user]);

  return (
    <MainContext.Provider value={contextValues}>
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
    </MainContext.Provider>
  );
};

export { MainContext, useMainContext, MainContextProvider as default };
