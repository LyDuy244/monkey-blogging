import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const PostMetaStyles = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 14px;
    font-weight: 600;
    color: inherit;

    .post{
        &-dot {
            display: inline-block;
            width: 4px;
            height: 4px;
            background-color: currentColor;
            border-radius: 100rem;
        }
    }

`

const PostMeta = ({ date = 'Mar 23', author = 'Andiez Le', className = '', to=''}) => {
    return (
        <PostMetaStyles className={className}>
            <span className="post-time">{date}</span>
            <span className="post-dot"></span>
            <Link to={`/${to}`}>
                <span className="post-author">{author}</span>
            </Link>
        </PostMetaStyles>
    );
};

PostMeta.propTypes = {
    date: PropTypes.string,
    author: PropTypes.string,
    className: PropTypes.string,
    to: PropTypes.string,
};

export default PostMeta;