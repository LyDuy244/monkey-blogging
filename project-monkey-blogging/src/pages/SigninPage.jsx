import React, { useEffect } from 'react';
import { useAuthContext } from '../context/auth-context';
import { NavLink, useNavigate } from 'react-router-dom';
import AuthenticationPage from './AuthenticationPage';
import { useForm } from 'react-hook-form';
import { Field } from '../components/field';
import { Label } from '../components/Label';
import { InputField } from '../components/InputField';
import { Button } from '../components/button';
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { toast } from 'react-toastify';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebase-config';
import PasswordField from '../components/InputField/PasswordField';

const schema = yup
    .object({
        email: yup.string().email("Please enter your email valid").required("Please enter your Email address"),
        password: yup.string().min(8, "Your password must be at lease 8 characters").required("Please enter your Password"),
    })

const SigninPage = () => {
    const { handleSubmit, control, formState: { isSubmitting, errors, isValid } } = useForm({
        mode: "onChange",
        resolver: yupResolver(schema)
    })


    useEffect(() => {
        const arrErrors = Object.values(errors);
        if (arrErrors.length > 0) {
            toast.error(arrErrors[0].message, {
                pauseOnHover: false,
                delay: 0,
            })
        }
    }, [errors])

    const { userInfo } = useAuthContext();
    const navigate = useNavigate()
    // console.log(userInfo)
    useEffect(() => {
        document.title = "Login Page"
        if (userInfo?.email) navigate('/')
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleSignIn = async (values) => {
        if (!isValid) return
        await signInWithEmailAndPassword(auth, values.email, values.password)
        navigate('/')
    }


    return (
        <AuthenticationPage>
            <form className='form' onSubmit={handleSubmit(handleSignIn)} autoComplete='off'>
                <Field>
                    <Label
                        htmlFor='email'
                    >
                        Email address
                    </Label>
                    <InputField
                        control={control}
                        name='email'
                        type='email'
                        placeholder='Enter your email address'>
                    </InputField>
                </Field>
                <Field>
                    <Label
                        htmlFor='password'
                    >
                        Password
                    </Label>
                    <PasswordField
                        name="password"
                        placeholder="Enter your password"
                        control={control}
                        type="password" ></PasswordField>
                </Field>
                <div className='have-account'>You already have an account? <NavLink to={"/sign-up"}>Register    </NavLink></div>
                <Button
                    isLoading={isSubmitting}
                    disabled={isSubmitting}
                    kind='primary'
                    type='submit'
                    style={{
                        width: '100%',
                        maxWidth: 300,
                        margin: '0 auto'
                    }}
                >Sign In
                </Button>
            </form>
        </AuthenticationPage>
    );
};

export default SigninPage;