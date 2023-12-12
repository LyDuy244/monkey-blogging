import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const PostImageStyles = styled.div`
    img {
        width: 100%;
        height: 100%;
        border-radius: inherit;
        object-fit: cover;
    }
`

const PostImage = ({ className = '', url = '', alt = '', to = '' }) => {
    if (to) return (
        <Link to={`/${to}`} style={{display: 'block', width: '100%'}}>
            <PostImageStyles className={className}>
                <img src={url} alt={alt} loading='lazy' />
            </PostImageStyles>
        </Link>
    )
    return (
        <PostImageStyles className={className}>
            <img src={url} alt={alt} loading='lazy' />
        </PostImageStyles>
    );
};

export default PostImage;