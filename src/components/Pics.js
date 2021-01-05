import { useEffect, useRef, useState } from "react";
import { db } from "../firebase/index";
import { useMainContext } from "../context/MainContext";

import { Container, Media } from "react-bootstrap";

const Pics = () => {
  const { user } = useMainContext();
  const [allPics, setPics] = useState("");

  useEffect(() => {
    let snapshotPics;
    snapshotPics = [];

    db.collection(`pics`).onSnapshot((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        snapshotPics.push(doc.data());
      });

      setPics(Object.values(...snapshotPics));
    });
  }, []);

  return (
    <>
      <Container>
        {allPics &&
          allPics.map((pic) => {
            return (
              <Media id="media" key={pic.id}>
                <img
                  width="100%"
                  height="auto"
                  src={pic.url}
                  alt="Generic placeholder"
                />
              </Media>
            );
          })}
      </Container>
    </>
  );
};

export default Pics;
