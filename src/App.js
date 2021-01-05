import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Login from "./components/Login.js";
import Home from "./components/Home.js";
import AuthContextProvider from "./context/AuthContext";
import { Row } from "react-bootstrap";
import "./App.css";

function App() {
  return (
    <AuthContextProvider>
      <Router>
        <div className="App">
          <header className="App-header">
            <nav>
              <Row sm={12} md={10} lg={12}>
                <ul id="list-nav" className="mt-3">
                  <li className="pr-5 ml-0">
                    <Link to="/">Amazing Photography</Link>
                  </li>
                  <div className="d-flex">
                    <li className="px-3">
                      <Link to="/albums">Albums</Link>
                    </li>
                    <li className="px-3">
                      <Link to="/pics">Pics</Link>
                    </li>
                    <li className="px-3">
                      <Link to="/login">Login</Link>
                    </li>
                  </div>
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
    </AuthContextProvider>
  );
}

export default App;
