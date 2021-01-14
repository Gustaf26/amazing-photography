import { useEffect, useState } from "react";
import { db } from "../firebase";

const usePics = (photos) => {
  const [pics, setPicsInDb] = useState(photos);

  useEffect(() => {
    db.collection("pics")
      .doc("all-pics")
      .set({ ...pics })
      .then(function () {
        console.log("Document successfully written!");
      })
      .catch(function (error) {
        console.error("Error writing document: ", error);
      });
  }, [pics]);

  return { setPicsInDb };
};

export default usePics;
