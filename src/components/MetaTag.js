import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * 
 * @param {*} title 제목
 * @param {*} description 설명
 * @param {*} url url
 */
function MetaTag(props) {
    return (
        <Helmet>
            <title>{props.title}</title>

            <meta name="description" content={props.description} />

            <meta property="og:type" content="website" />
            <meta property="og:title" content={props.title} />
            <meta property="og:site_name" content={props.title} />
            <meta property="og:description" content={props.description} />
            <meta property="og:url" content={props.url} />

            <meta name="twitter:title" content={props.title} />
            <meta name="twitter:description" cont ent={props.description} />

            <link rel="canonical" href={props.url} />
        </Helmet>
    );
};

export default MetaTag;