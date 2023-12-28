import React from 'react';
import { useController } from 'react-hook-form';
import styled from 'styled-components';

const TextareaStyles = styled.div`
    position:  relative;
    width: 100%;
    .textarea{
        width: 100%;
        padding: 16px 20px;
        background-color: ${props => props.theme.grayLight};
        border-radius: 8px;
        font-weight: 500;
        transition: all .2s linear;
        border: 1px solid transparent;
        resize: none;
        min-height: 200px;
    }

    .textarea::-webkit-textarea-placeholder{
        color: #84878B;
        border-color: ${props => props.theme.primary};
    }
    .textarea::-moz-textarea-placeholder{
        color: #84878B;
    }
    .textarea:focus{
        border-color: ${props => props.theme.primary};
        background-color: white;
    }
`

function Textarea({
    name = "",
    control,
    children,
    ...props
}) {
    const { field } = useController({ control, name, defaultValue: "" })
    return (
        <TextareaStyles>
            <textarea
                id={name}
                {...field}
                {...props}
                className='textarea'
            />
        </TextareaStyles>
    );
};

export default Textarea;