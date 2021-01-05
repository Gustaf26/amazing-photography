import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Login from "./components/Login.js";
import Home from "./components/Home.js";
import { useAuth } from "./context/AuthContext";
import { useMainContext } from "./context/MainContext";
import { Row } from "react-bootstrap";
import "./App.css";

function App() {
  const { user } = useMainContext();
  const { logout } = useAuth();

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <nav>
            <Row sm={12} md={10} lg={12}>
              <ul className="mt-3 list-nav">
                <li className="pr-5 ml-0">
                  <Link to="/">Amazing Photography</Link>
                </li>
                {user ? (
                  <ul className="d-flex list-nav">
                    <li className="px-3">
                      <Link to="/albums">Albums</Link>
                    </li>
                    <li className="px-3">
                      <Link to="/pics">Pics</Link>
                    </li>
                    <li className="px-3">
                      <p onClick={logout}>Logout</p>
                    </li>
                  </ul>
                ) : (
                  <li className="px-3">
                    <Link to="/login">Login</Link>
                  </li>
                )}
              </ul>
            </Row>
          </nav>
        </header>
        <Switch>
          {/* <Route path="/albums">
            <Albums />
          </Route>
          <Route path="/pics">
            <Pics />
          </Route> */}
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
