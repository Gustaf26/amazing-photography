import React, { useCallback, useState, useEffect } from "react";
import { storage } from "../firebase/index";
import { useDropzone } from "react-dropzone";

const UploadImage = () => {
  const [uploadProgress, setUploadProgress] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [file, setFile] = useState("");

  useEffect(() => {
    if (!file) {
      setUploadProgress(null);
      setUploadedImage(null);
      setError(null);
      setIsSuccess(false);

      return;
    }

    // reset environment
    setError(null);
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
        console.log(url);
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
    <div className="upload-dropzone mx-auto my-3" {...getRootProps()}>
      <input {...getInputProps()} />
      <p>Drag 'n' drop some files here, or click to select files</p>
    </div>
  );
};

export default UploadImage;
