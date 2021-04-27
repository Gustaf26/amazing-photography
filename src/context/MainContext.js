import { createContext, useContext, useEffect, useState } from "react";
import { db } from "../firebase";
import { Button, Spinner } from "react-bootstrap";

const MainContext = createContext();

const useMainContext = () => {
  return useContext(MainContext);
};

const MainContextProvider = (props) => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState("");
  const [allPicsInDb, setAllPics] = useState();
  const [allAlbums, setAlbums] = useState();
  const [currentAlbum, setCurrentAlbum] = useState("");
  const [albumPics, setAlbumPics] = useState([]);
  const [clientAlbum, setClientAlbum] = useState({});

  const resetPicsSelection = () => {
    const allPics = [...allPicsInDb];
    allPics.map((picture) => (picture.selected = false));

    db.collection("pics")
      .doc("all-pics")
      .set({ ...allPics })
      .then(function () {
        console.log("Document successfully written!");
      })
      .catch(function (error) {
        console.error("Error writing document: ", error);
      });
  };
  const contextValues = {
    setUser,
    user,
    allPicsInDb,
    setAllPics,
    allAlbums,
    resetPicsSelection,
    setCurrentAlbum,
    currentAlbum,
    albumPics,
    setAlbumPics,
    clientAlbum,
    setClientAlbum,
  };

  useEffect(() => {
    if (user) {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    let picsInAlbum = [];
    setAlbumPics([]);
    if (currentAlbum && currentAlbum.photo_urls) {
      picsInAlbum = currentAlbum.photo_urls.map((photo) => photo);

      if (picsInAlbum.length) {
        let emptyArr;
        emptyArr = [];
        allPicsInDb.map((pic) => {
          picsInAlbum.map((albumPic) => {
            if (albumPic === pic.url) {
              pic.selected = true;
              emptyArr.push(pic);
            }
          });
        });
        if (emptyArr.length) {
          setAlbumPics(emptyArr);
        }

        emptyArr = [];
      }
    }
  }, [currentAlbum]);

  useEffect(() => {
    let snapshotPics;
    let snapshotAlbums;

    db.collection(`pics`).onSnapshot((querySnapshot) => {
      snapshotPics = [];

      querySnapshot.forEach((doc) => {
        snapshotPics.push(doc.data());
      });
      setAllPics(Object.values(...snapshotPics));
    });

    db.collection(`albums`).onSnapshot((querySnapshot) => {
      snapshotAlbums = [];

      querySnapshot.forEach((doc) => {
        snapshotAlbums.push(doc.data());
      });
      setAlbums(snapshotAlbums);
    });

    return setAllPics();
  }, []);

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
