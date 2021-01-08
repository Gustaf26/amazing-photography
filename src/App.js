import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Login from "./components/Login.js";
import Home from "./components/Home.js";
import Pics from "./components/Pics.js";
import Albums from "./components/Albums.js";
import Album from "./components/Album";
import Create from "./components/Create.js";
import Update from "./components/Update";
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
              <ul className="mt-3 main-nav d-flex">
                <li id="home-icon" className="pr-5 ml-0 my-2">
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
                    <li className="px-3 mt-3">
                      <p onClick={logout}>Logout</p>
                    </li>
                  </ul>
                ) : (
                  <li className="px-3 my-2">
                    <Link to="/login">Login</Link>
                  </li>
                )}
              </ul>
            </Row>
          </nav>
        </header>
        <Switch>
          <Route exact path="/albums">
            <Albums />
          </Route>
          <Route path="/albums/create">
            <Create />
          </Route>
          <Route exact path="/albums/:albumId">
            <Album />
          </Route>
          <Route path="/albums/:albumId/update">
            <Update />
          </Route>
          <Route path="/pics">
            <Pics />
          </Route>
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
