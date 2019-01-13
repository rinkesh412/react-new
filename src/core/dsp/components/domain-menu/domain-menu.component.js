import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List, ProgressIndicatorCircular } from '@nokia-csf-uxr/csfWidgets';
import Menu, { SubMenu, Item as MenuItem, Divider } from 'rc-menu';
import LocalisedText from '../localised-text/localised-text.component';
import { DSPConsumer } from '../../utils/dsp.context';
import CommonUtils from '../../utils/common.utils';
import 'rc-menu/assets/index.css';
import './domain-menu.component.styl';

export class DomainMenu extends Component {

    constructor(props) {
        super(props);
        this.state = {
            menuItemKeyPath: [],
            initial: true,
            openKeys: [],
            currentKeys: [],
            domain: null,
            menuMap: null,
            overflowedIndicator: <span>More...</span>
        };

        this.menuItemKeyPath = [];
        this.allKeys = [];
        this._menu = React.createRef();
        this.handleClick = this.handleClick.bind(this);
        this.onSelectMenuAction = this.onSelectMenuAction.bind(this);
    }

    componentDidMount() {
        let domain = this.props.domain;
        let hostname = window.location.hostname;
        const url = `//${hostname}/portalweb/resource/smp/portalweb/sites/dsp/resources/maps/${domain}Menu.json`;

        fetch(url)
            .then(response => response.json())
            .then(data => this.setState({ domain: this.props.domain, menuMap: data.menus }));
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (this.state.domain !== nextState.domain);
    }

    handleClick(menuInfo) {
        this.menuItemKeyPath = menuInfo.keyPath;
        this.props.targetHandler(menuInfo);
    }

    onSelectMenuAction(ev) {
        if (ev.type === 'onSelect') {
            switch (ev.value.id) {
                case 'expandAll':
                    this._menu.current.store.setState({ openKeys: this.allKeys });
                    break;
            }
        }
    }

    render() {
        const { overflowedIndicator } = this.state;
        let pageClassName = '';

        const MenuRender = (data, parentKey, context, domain) => (
            data.map((m, i) => {
                if (m['roles'] && !CommonUtils.intersectStr(context.userRoles, m['roles']))
                    return null;

                if (m['menus']) {
                    if (m.className && m.className !== pageClassName)
                        pageClassName = m.className;

                    let aKey = parentKey ? parentKey + '-' + i : 'index-' + i;
                    if (!this.allKeys.includes(aKey)) {
                        this.allKeys.push(aKey);
                    }

                    return (
                        <SubMenu key={aKey} className={m.className ? m.className : ''}
                            title={<span className="submenu-title-wrapper"><LocalisedText localeMap={m.title} /></span>}
                            popupClassName={`${domain}-domain-menu`}
                        >
                            { MenuRender(m['menus'], aKey, context, domain) }
                        </SubMenu>
                    );
                } else if (m['type'] === 'divider') {
                    return (<Divider />);
                } else {
                    return (<MenuItem key={m.target} pageClassName={pageClassName}><LocalisedText localeMap={m.title} /></MenuItem>);
                }
            })
        );

        if (this.state.menuMap) {
            return (
                <DSPConsumer>
                    { context =>
                        <div className="domain-menu-container">
                            <List onSelect={this.onSelectMenuAction} id="listMenuActions"
                                items={[
                                    { id: 'expandAll', label: CommonUtils.getLocaleText({ en: 'Expand All', ja: 'すべて展開' }), icon: '/portal/static/images/ic_cardw_down.svg' }
                                ]}
                            />
                            <Menu
                                className={'domain-menu ' + this.props.domain + '-domain-menu'}
                                mode="inline"
                                selectable = "false"
                                activeKey={this.props.activeKey}
                                defaultSelectedKeys={[ this.props.activeKey ]}
                                openAnimation="slide-up"
                                onClick={this.handleClick}
                                overflowedIndicator={overflowedIndicator}
                                ref={this._menu}
                            >
                                { MenuRender(this.state.menuMap, null, context, this.props.domain) }
                            </Menu>
                        </div>
                    }
                </DSPConsumer>
            );
        } else {
            return (<ProgressIndicatorCircular />);
        }
    }
}

export default DomainMenu;

DomainMenu.propTypes = {
    domain: PropTypes.string.isRequired,
    activeKey: PropTypes.string,
    targetHandler: PropTypes.func.isRequired
};