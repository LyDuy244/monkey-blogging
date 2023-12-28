import { useState } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";

export default function useFirebaseImage(setValue, getValues, imageName = null, cb) {
    const [progress, setProgress] = useState(0);
    const [image, setImage] = useState('')

    if (!setValue || !getValues) return;

    const handleUpdateImage = (file) => {
        const storage = getStorage();
        const storageRef = ref(storage, 'image/' + file.name);
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on('state_changed',
            (snapshot) => {
                // Observe state change events such as progress, pause, and resume
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progressPercent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setProgress(progressPercent)
                switch (snapshot.state) {
                    case 'paused':
                        // console.log('Upload is paused');
                        break;
                    case 'running':
                        // console.log('Upload is running');
                        break;
                    default:
                        console.log("Nothing at all")
                }
            },
            (error) => {
                // Handle unsuccessful uploads
                console.log('upload error', error)
            },
            () => {
                // Handle successful uploads on complete
                // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImage(downloadURL)
                });
            }
        );

    }

    const handleSelectImage = (e) => {
        const file = e.target.files[0];
        // console.log("🚀 ~ file: PostAddNew.jsx:79 ~ onSelectImage ~ file:", file)
        if (!file) return;
        setValue('image_name', file.name)
        handleUpdateImage(file)
    }

    const handleResetUpload = () => {
        setImage('');
        setProgress(0);
    }
    const handleDeleteImage = () => {
        if(imageName === 'user.png' || getValues("image_name") === 'user.png'){
            handleResetUpload();
            return;
        }

        const storage = getStorage();

        const desertRef = ref(storage, 'image/' + (imageName || getValues('image_name')));

        deleteObject(desertRef).then(() => {

            console.log('Remove image successfully')
            handleResetUpload();

            cb && cb()

        }).catch((error) => {
            console.log("Can not delete image")
        });
    }


    return {
        handleSelectImage,
        handleDeleteImage,
        progress,
        image,
        setImage,
        handleResetUpload
    }
};

