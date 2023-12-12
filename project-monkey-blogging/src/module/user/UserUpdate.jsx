import React, { useEffect } from 'react';
import DashboardHeading from '../dashboard/DashboardHeading';
import { Button } from '../../components/button';
import { useForm } from 'react-hook-form';
import ImageUpload from '../../components/image/ImageUpload';
import useFirebaseImage from '../../hooks/useFirebaseImage';
import { Field, FieldCheckBoxes } from '../../components/field';
import { Label } from '../../components/Label';
import { InputField } from '../../components/InputField';
import { Radio } from '../../components/checkbox';
import { userRole, userStatus } from '../../utils/constans';
import { useSearchParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase-config';
import { toast } from 'react-toastify';
import Textarea from '../../components/textarea/Textarea';
import { useAuthContext } from '../../context/auth-context';

const UserUpdate = () => {
    const { control, reset, handleSubmit, watch, setValue, getValues, formState: {
        isSubmitting,
        isValid
    } } = useForm({
        mode: 'onChange'
    })
    const watchStatus = watch('status')
    const watchRole = watch('role')
    const imageUrl = getValues('avatar')
    const imageRegex = /%2F(\S+)\?/gm.exec(imageUrl)
    const image_name = imageRegex?.length > 0 ? imageRegex[1] : ''
    const deleteAvatar = async () => {
        const colRef = doc(db, 'users', userId);
        await updateDoc(colRef, { avatar: '' })
    }
    const { image, progress, handleSelectImage, setImage, handleDeleteImage } = useFirebaseImage(setValue, getValues, image_name, deleteAvatar);
    const [param] = useSearchParams();
    const userId = param.get('id')
    function getBirthDay(date) {
        if (!date) return;
        return `${date.getFullYear()}-${date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + date.getMonth() + 1}-${date.getDate() > 9 ? date.getDate() : '0' + date.getDate()}`
    }
    const handleUpdateUser = async (values) => {
        if (!isValid) return;
        try {
            const colRef = doc(db, 'users', userId);
            await updateDoc(colRef, {
                ...values,
                birthday: new Date(values.birthday),
                role: Number(values.role),
                avatar: image
            })
            toast.success("Update use information successfully")
        } catch (error) {
            console.log("🚀 ~ file: UserUpdate.jsx:35 ~ hanleUpdateUser ~ error:", error)
            toast.error("Update use failed")
        }
    }

    useEffect(() => {
        async function fetchData() {
            if (!userId) return;
            const colRef = doc(db, 'users', userId);
            const singleDoc = await getDoc(colRef);
            reset(singleDoc && {
                ...singleDoc.data(),
                birthday: getBirthDay(new Date(singleDoc.data()?.birthday?.seconds * 1000))
            })
        }
        fetchData()
    }, [reset, userId])

    useEffect(() => {
        setImage(imageUrl)
    }, [imageUrl, setImage])

    const { userInfo } = useAuthContext();
    if (userInfo.role !== userRole.ADMIN) return;
    if (!userId) return null;
    return (
        <div>
            <DashboardHeading
                title="Update Users"
                desc="Update user information"
            >
            </DashboardHeading>

            <form onSubmit={handleSubmit(handleUpdateUser)}>
                <div className='w-[200px] h-[200px] rounded-full mx-auto mb-10' >
                    <ImageUpload name='avatar' image={image} process={progress} onChange={handleSelectImage} handleDeleteImage={handleDeleteImage} className='!rounded-full h-full'></ImageUpload>
                </div>
                <div className="form-layout">
                    <Field>
                        <Label>Fullname</Label>
                        <InputField
                            name="fullname"
                            placeholder="Enter your fullname"
                            control={control}
                        ></InputField>
                    </Field>
                    <Field>
                        <Label>Username</Label>
                        <InputField
                            name="username"
                            placeholder="Enter your username"
                            control={control}
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
                            placeholder="dd/mm/yyyy"
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
                            name="email"
                            placeholder="Enter your email"
                            control={control}
                            type="email"
                        ></InputField>
                    </Field>
                    <Field>
                        <Label>Password</Label>
                        <InputField
                            name="password"
                            placeholder="Enter your password"
                            control={control}
                            type="password"
                        ></InputField>
                    </Field>
                </div>
                <div className="form-layout">
                    <Field>
                        <Label>Status</Label>
                        <FieldCheckBoxes>
                            <Radio name="status" control={control}
                                checked={Number(watchStatus) === userStatus.ACTIVE}
                                value={userStatus.ACTIVE}>
                                Active
                            </Radio>
                            <Radio name="status" control={control}
                                checked={Number(watchStatus) === userStatus.PENDING}
                                value={userStatus.PENDING}>
                                Pending
                            </Radio>
                            <Radio name="status" control={control}
                                checked={Number(watchStatus) === userStatus.BAN}
                                value={userStatus.BAN}>
                                Banned
                            </Radio>
                        </FieldCheckBoxes>
                    </Field>
                    <Field>
                        <Label>Role</Label>
                        <FieldCheckBoxes>
                            <Radio name="role" control={control}
                                checked={Number(watchRole) === userRole.ADMIN}
                                value={userRole.ADMIN}>
                                Admin
                            </Radio>
                            <Radio name="role" control={control}
                                checked={Number(watchRole) === userRole.MOD}
                                value={userRole.MOD}>
                                Moderator
                            </Radio>
                            <Radio name="role" control={control}
                                checked={Number(watchRole) === userRole.USER}
                                value={userRole.USER}>
                                User
                            </Radio>
                        </FieldCheckBoxes>
                    </Field>
                </div>
                <div className="form-layout">
                    <Field>
                        <Label>Description</Label>
                        <Textarea
                            name="description"
                            placeholder="Enter your description"
                            control={control}>

                        </Textarea>
                    </Field>
                </div>
                <Button isLoading={isSubmitting} disabled={isSubmitting} type='submit' kind="primary" className="mx-auto w-[200px]">
                    Update
                </Button>
            </form>
        </div>

    );
};

export default UserUpdate;