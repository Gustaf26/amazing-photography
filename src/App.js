import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import SimpleReactLightbox from "simple-react-lightbox";
import Login from "./components/Login.js";
import Register from "./components/Register.js";
import Home from "./components/Home.js";
import Pics from "./components/Pics.js";
import Albums from "./components/Albums.js";
import Album from "./components/Album";
import Create from "./components/Create.js";
import Update from "./components/Update";
import EditTitle from "./components/EditTitle";
import Albumreview from "./components/Albumreview";
import { useAuth } from "./context/AuthContext";
import { useMainContext } from "./context/MainContext";
import { Row } from "react-bootstrap";
import "./App.css";

function App() {
  const { user, allAlbums } = useMainContext();
  const { logout } = useAuth();

  return (
    <SimpleReactLightbox>
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
                    <ul className="d-flex list-nav pr-4">
                      <li className="px-3">
                        <Link to="/albums">Albums</Link>
                      </li>
                      <li className="px-3">
                        <Link to="/pics">Pics</Link>
                      </li>
                      <li className="px-3 mt-3">
                        <p onClick={logout}>
                          <Link to="/">Logout</Link>
                        </p>
                      </li>
                    </ul>
                  ) : (
                    <li>
                      <span className="px-3 my-2">
                        <Link to="/login">Login</Link>
                      </span>
                      <span className="px-3 my-2">
                        <Link to="/register">Register</Link>
                      </span>
                    </li>
                  )}
                </ul>
              </Row>
            </nav>
          </header>
          <Routes>
            <Route path="/">
              <Home />
            </Route>
            {user ? (
              <Route>
                <Route path="/albums">
                  <Albums />
                </Route>
                <Route path="/albums/create">
                  <Create />
                </Route>
                <Route path="/albums/:albumId">
                  <Album />
                </Route>
                <Route path="/albums/:albumId/update">
                  <Update />
                </Route>
                <Route path="/albums/:albumId/edit-title">
                  <EditTitle />
                </Route>
                <Route path="/pics">
                  <Pics />
                </Route>
              </Route>
            ) : (
              <Route>
                <Route path="/login">
                  <Login />
                </Route>
                <Route path="/register">
                  <Register />
                </Route>
              </Route>
            )}

            {allAlbums && allAlbums.length && (
              <Route path="/review/:albumId">
                <Albumreview />
              </Route>
            )}
          </Routes>
        </div>
      </Router>
    </SimpleReactLightbox>
  );
}

export default App;
