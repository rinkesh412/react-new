import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import CommonUtils from '../../utils/common.utils';

export class LocalisedText extends PureComponent {

    state = { text: CommonUtils.getLocaleText(this.props.localeMap) }

    render() {
        const { text } = this.state;
        if (this.props.wrapperTag) {
            const WrapperTag = `${this.props.wrapperTag}`;
            return (
                <WrapperTag
                    className={(this.props.wrapperClassName || '')}
                >{text}</WrapperTag>
            );
        } else {
            return text;
        }
    }
}

LocalisedText.propTypes = {
    localeMap: PropTypes.string.isRequired,
    wrapperTag: PropTypes.string,
    wrapperClassName: PropTypes.string
};

export default LocalisedText;