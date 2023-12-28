import { Button } from "../../components/button";
import { Radio } from "../../components/checkbox";
import { Field, FieldCheckBoxes } from "../../components/field";
import ImageUpload from "../../components/image/ImageUpload";
import { InputField } from "../../components/InputField";
import { Label } from "../../components/Label";
import DashboardHeading from "../dashboard/DashboardHeading";
import React from "react";
import { useForm } from "react-hook-form";
import { createUserWithEmailAndPassword, updateCurrentUser } from 'firebase/auth'
import { userRole, userStatus } from "../../utils/constans";
import useFirebaseImage from "../../hooks/useFirebaseImage";
import { auth, db } from "../../firebase/firebase-config";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import slugify from "slugify";
import { toast } from "react-toastify";
import { useAuthContext } from "../../context/auth-context";

const UserAddNew = () => {
  const { control, handleSubmit, setValue, getValues, watch, reset, formState: { isValid, isSubmitting } } = useForm({
    mode: "onChange",
    defaultValues: {
      fullname: '',
      email: '',
      password: '',
      username: '',
      avatar: '',
      phone:"",
      birthday: "",
      status: userStatus.ACTIVE,
      role: userRole.USER,
      createdAt: new Date()
    }
  });
  const { image, progress, handleSelectImage, handleDeleteImage, handleResetUpload } = useFirebaseImage(setValue, getValues);
  console.log("🚀 ~ file: UserAddNew.jsx:33 ~ UserAddNew ~ image:", image)

  const watchStatus = watch('status')
  const watchRole = watch('role')
  const handleCreateUser = async (values) => {
    if (!isValid) return;
    try {
      const originalUser = auth.currentUser
      await createUserWithEmailAndPassword(auth, values.email, values.password)
      await setDoc(doc(db, 'users', auth.currentUser.uid), {
        fullname: values.fullname,
        email: values.email,
        password: values.password,
        username: slugify(values.username || values.fullname, { lower: true, replacement: " ", trim: true }),
        avatar: image,
        phone:values.phone,
        birthday: new Date(values.birthday),
        status: Number(values.status),
        role: Number(values.role),
        createdAt: serverTimestamp()
      });
      toast.success(`Create new user with email ${values.email} successfully`)
      reset({
        fullname: '',
        email: '',
        password: '',
        username: '',
        avatar: '',
        status: userStatus.ACTIVE,
        role: userRole.USER,
        createdAt: new Date(),
        phone:"",
        birthday: "",
      })
      handleResetUpload();
      updateCurrentUser(auth, originalUser)
    } catch (error) {
      console.log("🚀 ~ file: UserAddNew.jsx:63 ~ handleCreateUser ~ error:", error)
      toast.error('Can not create new user')
    }
  }

  const {userInfo} = useAuthContext();
  if(userInfo.role !== userRole.ADMIN) return;
  return (
    <div>
      <DashboardHeading
        title="New user"
        desc="Add new user to system"
      ></DashboardHeading>
      <form onSubmit={handleSubmit(handleCreateUser)}>
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
                checked={Number(watchRole) === userRole.USER}
                value={userRole.USER}>
                User
              </Radio>
            </FieldCheckBoxes>
          </Field>
        </div>
        <Button isLoading={isSubmitting} disabled={isSubmitting} type='submit' kind="primary" className="mx-auto w-[200px]">
          Add new user
        </Button>
      </form>
    </div>
  );
};

export default UserAddNew;