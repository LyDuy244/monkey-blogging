import React from 'react';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';






const PostTitleStyles = styled.h3`
    font-weight: 600;
    line-height: 1.5;
    a{
        display: block;
    }
    ${props => props.size === 'normal' &&
        css`
        font-size: 18px;
    `
    };
    ${props => props.size === 'big' &&
        css`
        font-size: 22px;
    `
    };
`

const PostTitle = ({ children, className = '', size = 'normal', to = '' }) => {
    return (
        <PostTitleStyles className={className} size={size}>
            <Link to={`/${to}`}>
                {children}
            </Link>
        </PostTitleStyles>
    );
};

PostTitle.propTypes = {
    className: PropTypes.string,
    size: PropTypes.string,
    to: PropTypes.string,
};

export default PostTitle;