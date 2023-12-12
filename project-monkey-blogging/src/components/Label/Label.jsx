import React from 'react';
import styled from 'styled-components';

const LabelStyles = styled.label`
    color: ${props => props.theme.grayDark};
    cursor: pointer;
    font-weight: 600;
`

const Label = ({ htmlFor = "", children, ...props }) => {
    return (
        <LabelStyles htmlFor="fullname" {...props}>
            {children}
        </LabelStyles>
    );
};

export default Label;