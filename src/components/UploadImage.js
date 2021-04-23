import React, { useCallback, useState, useEffect, useRef } from "react";
import { db, storage } from "../firebase/index";
import { useDropzone } from "react-dropzone";
import Alert from "react-bootstrap";
import { useMainContext } from "../context/MainContext";

const UploadImage = ({ albumName, setErrorMsg }) => {
  const [uploadProgress, setUploadProgress] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [file, setFile] = useState();
  const imageUrl = useRef([]);
  const { setAllPics, allPicsInDb, user } = useMainContext();

  useEffect(() => {
    setErrorMsg(true);
  }, []);

  useEffect(() => {
    if (!file) {
      setErrorMsg(true);
      setUploadProgress(null);
      setUploadedImage(null);
      setError(true);
      setIsSuccess(false);

      return;
    }

    if (!albumName) {
      alert("You need to set first an album name");
      return;
    }

    // reset environment
    setError(null);
    setErrorMsg(false);
    setIsSuccess(false);

    // get file reference
    const fileRef = storage.ref(`allPics/${file.name}`);

    // upload file to fileRef
    const uploadTask = fileRef.put(file);

    // attach listener for `state_changed`-event
    uploadTask.on("state_changed", (taskSnapshot) => {
      setUploadProgress(
        Math.round(
          (taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) * 100
        )
      );
    });

    // are we there yet?
    uploadTask.then((snapshot) => {
      // retrieve URL to uploaded file
      snapshot.ref.getDownloadURL().then((url) => {
        // add uploaded file to db
        if (url) {
          imageUrl.current = url;

          let allPics = { ...allPicsInDb };
          let ranNum = Math.floor(Math.random() * 1000);

          db.collection("pics")
            .doc("all-pics")
            .set({
              ...allPics,
              ranNum: {
                id: ranNum,
                url: imageUrl.current,
                albums: [`${albumName.toLowerCase()}`],
                selected: true,
                user: user.email,
              },
            })
            .then(function () {
              console.log("Document successfully written!");
            })
            .catch(function (error) {
              console.error("Error writing document: ", error);
            });
        }
      });
    });
  }, [file]);

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = () => {
        // Do whatever you want with the file contents
        // const binaryStr = reader.result;
        // console.log(binaryStr);
        setFile(file);
      };
      reader.readAsArrayBuffer(file);
    });
  }, []);
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div className="upload-dropzone mx-auto my-5" {...getRootProps()}>
      <input {...getInputProps()} />
      <p>
        Drag 'n' drop some files here, or click to select files -One at a time-
      </p>
    </div>
  );
};

export default UploadImage;
