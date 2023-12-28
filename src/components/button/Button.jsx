import React from 'react';
import styled, { css } from 'styled-components';
import { LoadingSpinner } from '../loading';
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom';

const ButtonStyles = styled.button`
    cursor: pointer;
    padding: 0 25px;
    line-height: 1;
    font-size: 18px;
    font-weight: 600;
    height: ${props => props.height || '66px'};
    display: flex;
    justify-content: center;    
    align-items: center;
    border-radius: 8px;
  
    ${props => props.kind === 'secondary' &&
        css`
        background-color: white;
        color: ${props => props.theme.primary};
    `
    };

    ${(props) => props.kind === 'primary' &&
        css`
        color: white;
        background-image: linear-gradient(to right bottom, ${props => props.theme.primary}, ${props => props.theme.secondary});
    `};

    ${(props) =>
        props.kind === "ghost" &&
        css`
      color: ${(props) => props.theme.primary};
      background-color: rgba(29, 192, 113, 0.1);
    `};

    &:disabled {
        opacity: .5;
        pointer-events: none;
    }
`

/**
 * @requires
 * @param {string} type Type of button 'button' || 'submit' 
 * @returns 
 */


function Button({
    type = 'button',
    onClick = () => { },
    children,
    kind = 'secondary',
    isLoading,
    ...props
}) {

    const child = !!isLoading ? <LoadingSpinner></LoadingSpinner> : children
    const { to } = props
    if (to !== '' && typeof to === 'string')
        return (
            <Link to={`/${to}`}>
                <ButtonStyles type={type} kind={kind} {...props}>
                    {child}
                </ButtonStyles>
            </Link>
        )


    return (
        <ButtonStyles type={type} kind={kind} onClick={onClick} {...props}>
            {child}
        </ButtonStyles>
    );
};

Button.propTypes = {
    type: PropTypes.oneOf(["button", "submit"]),
    isLoading: PropTypes.bool,
    onClick: PropTypes.func,
    kind: PropTypes.oneOf(["primary", "secondary", "ghost"]),
}

export default Button;