import React from 'react';
import PropTypes from 'prop-types';

import './item.layout.styl';

const Item = ({
    name, content, isOpen,
}) => {
    let result;
    if (isOpen) {
        result = (
            <div>
                <div className="csp-demo-expansion-header"> {name} </div>
                <pre style={{ fontFamily: 'Nokia Pure Text Regular, Arial, sans-serif', fontSize: '16px', color: 'black', opacity: 0.54 }}> {content} </pre>
            </div>
        );
    } else {
        result = (
            <div className="csp-demo-expansion-header"> {name} </div>
        );
    }
    return result;
};

Item.propTypes = {
    name: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    defaultOpen: PropTypes.bool,
    isOpen: PropTypes.bool
};

export default Item;