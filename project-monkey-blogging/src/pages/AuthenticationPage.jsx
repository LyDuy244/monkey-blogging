import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

const AuthenticationPageStyle = styled.div`
    min-height: 100vh;
    padding: 40px;
    
    .logo{
        margin:  0 auto;
    }

    .heading{
        text-align: center;
        color: ${props => props.theme.primary};
        font-size: 40px;
        font-weight: bold;
        margin-bottom: 60px;
    }

    .form{
        max-width: 600px;
        margin: 0 auto;
    }

    .have-account{
        margin-bottom: 20px;
        a{
            display: inline-block;
            color: ${props => props.theme.primary};
            font-weight: 500;
            text-decoration: none;
        }
    }
`

const AuthenticationPage = ({ children }) => {
    return (
        <AuthenticationPageStyle>
            <div className="container">
                <NavLink to='/'>
                    <img className='logo' srcSet="/logo.png 2x" alt="monkey-logging" />
                </NavLink>
                <h1 className="heading">Monkey Blogging</h1>
                {children}
            </div>
        </AuthenticationPageStyle>
    );
};

export default AuthenticationPage;