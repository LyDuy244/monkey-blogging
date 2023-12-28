import { Button } from "../../components/button";
import { Field } from "../../components/field";
import ImageUpload from "../../components/image/ImageUpload";
import { InputField } from "../../components/InputField";
import PasswordField from "../../components/InputField/PasswordField";
import { Label } from "../../components/Label";
import Textarea from "../../components/textarea/Textarea";
import { useAuthContext } from "../../context/auth-context";
import useFirebaseImage from "../../hooks/useFirebaseImage";
import DashboardHeading from "../dashboard/DashboardHeading";
import React, { useEffect  } from "react";
import { useForm } from "react-hook-form";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase-config";
import { toast } from "react-toastify";

const UserProfile = () => {
    const { userInfo } = useAuthContext();
    const { handleSubmit, control, reset, setValue, getValues, formState: {
        isSubmitting, isValid
    } } = useForm({
        mode: "onChange",
    });

    const imageUrl = getValues('avatar')
    const imageRegex = /%2F(\S+)\?/gm.exec(imageUrl)
    const image_name = imageRegex?.length > 0 ? imageRegex[1] : ''
    const deleteAvatar = async () => {
        const colRef = doc(db, 'users', userInfo.id);
        await updateDoc(colRef, { avatar: '' , image_name: ""})
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
   
    function getBirthDay(date) {
        console.log(date)
        if (!date) return;
        return `${date.getFullYear()}-${date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + date.getMonth() + 1}-${date.getDate() > 9 ? date.getDate() : '0' + date.getDate()}`
    }
    const { image, progress, handleSelectImage, setImage, handleDeleteImage } = useFirebaseImage(setValue, getValues, image_name, deleteAvatar);

    useEffect(() => {
        if (!userInfo) return;
        reset({
            fullname: userInfo.fullname,
            username: userInfo.username,
            phone: userInfo.phone,
            description: userInfo.description,
            password: userInfo.password,
            avatar: userInfo.avatar,
            email: userInfo.email,
            birthday: getBirthDay(new Date(userInfo.birthday?.seconds * 1000))
        })
    }, [reset, userInfo])

    useEffect(() => {
        setImage(imageUrl)
    }, [imageUrl, setImage])


    const handleUpdateProfile = async (values) => {
        if (!isValid) return;
        try {
            const colRef = doc(db, 'users', userInfo.id);
            await updateDoc(colRef, {
                ...values,
                birthday: new Date(values.birthday),
                avatar: image
            })
            toast.success("Update use information successfully")
        } catch (error) {
            console.log("🚀 ~ file: UserUpdate.jsx:35 ~ hanleUpdateUser ~ error:", error)
            toast.error("Update user failed")
        }
    }

    if (!userInfo) return;
    return (
        <div>
            <DashboardHeading
                title="Account information"
                desc="Update your account information"
            ></DashboardHeading>
            <form onSubmit={handleSubmit(handleUpdateProfile)}>
                <div className="w-[200px] h-[200px] rounded-full mx-auto mb-10">
                    <ImageUpload name='avatar' image={image} process={progress} onChange={handleSelectImage} handleDeleteImage={handleDeleteImage} className="!rounded-full h-full"></ImageUpload>
                </div>
                <div className="form-layout">
                    <Field>
                        <Label>Fullname</Label>
                        <InputField
                            control={control}
                            name="fullname"
                            placeholder="Enter your fullname"
                        ></InputField>
                    </Field>
                    <Field>
                        <Label>Username</Label>
                        <InputField
                            control={control}
                            name="username"
                            placeholder="Enter your username"
                        ></InputField>
                    </Field>
                </div>
                <div className="form-layout">
                    <Field>
                        <Label>Date of Birth</Label>
                        <InputField
                            control={control}
                            type="date"
                            name="birthday"
                        ></InputField>
                    </Field>
                    <Field>
                        <Label>Mobile Number</Label>
                        <InputField
                            control={control}
                            name="phone"
                            placeholder="Enter your phone number"
                        ></InputField>
                    </Field>
                </div>
                <div className="form-layout">
                    <Field>
                        <Label>Email</Label>
                        <InputField
                            control={control}
                            name="email"
                            type="email"
                            placeholder="Enter your email address"
                        ></InputField>
                    </Field>
                    <Field>
                        <Label>Description</Label>
                        <Textarea
                            name="description"
                            placeholder="Enter your description"
                            control={control}>

                        </Textarea>
                    </Field>
                </div>
                <div className="form-layout">
                    <Field>
                        <Label>New Password</Label>
                        <PasswordField
                            control={control}
                            name="password"
                            type="password"
                            placeholder="Enter your password"
                        ></PasswordField>
                    </Field>
                    
                </div>
                <Button type='submit' isLoading={isSubmitting} disabled={isSubmitting} kind="primary" className="mx-auto w-[200px]">
                    Update
                </Button>
            </form>
        </div>
    );
};

export default UserProfile;