import React, { useState } from 'react';
import { IconEyeClose, IconEyeOpen } from '../icon';
import InputField from './InputField';


const PasswordField = ({
    control,
    name,
    placeholder,

}) => {

    const [togglePassword, setTogglePassword] = useState(false)
    if (!control) return null;
    return (
        <InputField
            name={name}
            placeholder={placeholder}
            control={control}
            type={togglePassword ? 'text' : 'password'}
            >
            {togglePassword ?
                <IconEyeOpen
                    onClick={() => setTogglePassword(false)}>
                </IconEyeOpen>
                :
                <IconEyeClose
                    onClick={() => setTogglePassword(true)}>
                </IconEyeClose>
            }
        </InputField>
    );
};

export default PasswordField;