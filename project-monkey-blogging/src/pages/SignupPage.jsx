import React, { useEffect } from 'react';
import { Label } from '../components/Label';
import { InputField } from '../components/InputField';
import { useForm } from 'react-hook-form';
import { Field } from '../components/field';
import { Button } from '../components/button';
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { toast } from 'react-toastify';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth, db } from '../firebase/firebase-config';
import { NavLink, useNavigate } from 'react-router-dom';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import AuthenticationPage from './AuthenticationPage';
import PasswordField from '../components/InputField/PasswordField';
import slugify from 'slugify';
import { userRole, userStatus } from '../utils/constans';


const schema = yup
    .object({
        fullname: yup.string().required("Please enter your Fullname"),
        email: yup.string().email("Please enter your email valid").required("Please enter your Email address"),
        password: yup.string().min(8, "Your password must be at lease 8 characters").required("Please enter your Password"),
    })

const SignupPage = () => {

    const { control, handleSubmit, formState: { isValid, isSubmitting, errors } } = useForm(
        {
            mode: 'onChange',
            resolver: yupResolver(schema)
        }
    )
    const navigate = useNavigate()

    const handleSignUp = async (values) => {
        if (!isValid) return;

        await createUserWithEmailAndPassword(auth, values.email, values.password)
        updateProfile(auth.currentUser, {
            displayName: values.fullname,
            photoURL: "https://firebasestorage.googleapis.com/v0/b/monkey-blogging-1cd99.appspot.com/o/image%2Fuser.png?alt=media&token=84692ce5-5259-4176-a74c-2829286e10c6"

        })

        toast.success('Register successfully')


        await setDoc(doc(db, 'users', auth.currentUser.uid), {
            fullname: values.fullname,
            email: values.email,
            password: values.password,
            username: slugify(values.fullname, { lower: true }),
            avatar: 'https://firebasestorage.googleapis.com/v0/b/monkey-blogging-1cd99.appspot.com/o/image%2Fuser.png?alt=media&token=84692ce5-5259-4176-a74c-2829286e10c6',
            status: userStatus.ACTIVE,
            role: userRole.USER,
            createdAt: serverTimestamp()
        })


        navigate('/')
    }

    useEffect(() => {
        const arrErrors = Object.values(errors);
        if (arrErrors.length > 0) {
            toast.error(arrErrors[0].message, {
                pauseOnHover: false,
                delay: 0,
            })
        }
    }, [errors])

    useEffect(() => {
        document.title = "Register Page"
    }, [])

    return (
        <AuthenticationPage>
            <form className='form' onSubmit={handleSubmit(handleSignUp)} autoComplete='off'>
                <Field>
                    <Label htmlFor="fullname">Fullname</Label>
                    <InputField
                        control={control}
                        type="text"
                        name='fullname'
                        placeholder="Enter your fullname" >
                    </InputField>
                </Field>
                <Field>
                    <Label htmlFor="email">Email address</Label>
                    <InputField
                        control={control}
                        type="email"
                        name='email'
                        placeholder="Enter your email" >
                    </InputField>
                </Field>
                <Field>
                    <Label htmlFor="password">Password</Label>
                    <PasswordField
                        name="password"
                        placeholder="Enter your password"
                        control={control}
                        type="password"></PasswordField>
                </Field>

                <div className='have-account'>You have not had an account? <NavLink to={"/sign-in"}>Login</NavLink></div>

                <Button
                    isLoading={isSubmitting}
                    disabled={isSubmitting}
                    kind='primary'
                    type='submit'
                    style={{
                        with: '100%',
                        maxWidth: 300,
                        minWidth: 200,
                        margin: '0 auto'
                    }}
                >Sign Up
                </Button>
            </form>
        </AuthenticationPage>
    );
};

export default SignupPage;