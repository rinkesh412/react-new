import React from 'react';
import PropTypes from 'prop-types';
import { Button, ExpansionPanel } from '@nokia-csf-uxr/csfWidgets';
const Item = ({
    id, keypanels, isOpen, onDelete, headers, disableBtn, buttonLabel
}) => {
    let result;
    if (isOpen) {
        if (id === '0') {
            if (disableBtn === 'true') {
                result = (<div>
                    {keypanels}
                    <Button text={buttonLabel} onClick={onDelete} disabled />
                </div>);
            } else {
                result = (<div>
                    {keypanels}
                    <Button text={buttonLabel} onClick={onDelete} />
                </div>);
            }
        } else {
            if (disableBtn === 'true') {
                result = (<div>
                    {keypanels}
                    <Button text={buttonLabel} onClick={onDelete} disabled />
                </div>);
            } else {
                result = (<div>
                    {keypanels}
                    <Button text={buttonLabel} onClick={onDelete} />
                </div>);
            }
        }


    } else {
        result = (
            <div id={id} className="parentPanel">
                <div>
                    {headers}
                </div>
            </div>
        );
    }
    return result;
};

Item.propTypes = {
    id: PropTypes.string,
    name: PropTypes.string.isRequired,
    tel: PropTypes.string.isRequired,
    onDelete: PropTypes.func
};

Item.defaultProps = {
    id: undefined,
    onDelete: undefined
};

export default class DynamicExpansionPanelContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isButtonDisabled: false,
            dialog: false,
            name: 'name',
            tel: '123456789',
            idCount: '0',
            indexValue: '',
            isBackClicked: false,
            renderBackPanels: this.props.renderPanels,
            renderNextPanels: this.props.renderPanels,
            newBackPanels: [],
            childPanels: [ <ExpansionPanel showExpansionGap height={25} onExpand={this.toggle} onCollapse={this.toggle}>
                <Item keypanels={this.props.renderPanels[0]} id="0" key="0" onDelete={this.deleteHandler} isOpen="true" disableBtn="false" onBack={this.onBackClick} 
                    buttonLabel={this.props.buttonLabel[0]}  defaultOpen
                />
            </ExpansionPanel> ],
            newPanels: [ <ExpansionPanel showExpansionGap height={25} onExpand={this.toggle} onCollapse={this.toggle}>
                <Item keypanels={this.props.renderPanels[0]} id="0" key="0" onDelete={this.deleteHandler} isOpen="true" headers={this.props.renderHeaders[0]}
                    disableBtn="false" onBack={this.onBackClick} buttonLabel={this.props.buttonLabel[0]} defaultOpen
                />
            </ExpansionPanel> ],
            renPanels: [],
            onBackPanels: []
        };
        this.deleteHandler = this.deleteHandler.bind(this);
        this.onBackClick = this.onBackClick.bind(this);
        this.getNewPanelsWhenBackClicked = this.getNewPanelsWhenBackClicked.bind(this);
        this.getNewPanelsWithoutBackClicked=this.getNewPanelsWithoutBackClicked.bind(this);
    }
    onBackClick = () => {
        var newId = this.state.idCount;
        var newChange ='';
        var indexNew = '';
        var panels = this.state.newPanels.length;
        var extraPanel =[];
        this.setState({
            isBackClicked: 'true'
        });
        if (newId === this.state.renderBackPanels.length) {
            newChange = this.state.idCount;
            newChange--;
            this.setState({ idCount: newChange });
            newId--;
        } else if (newId > this.state.renderBackPanels.length) {
            var difference = newId - this.state.renderBackPanels.length;
            for (i = 0; i < difference; i++) {
                newChange = this.state.idCount;
                newChange--;
                this.setState({ idCount: this.state.idCount - 1 });
                newId--;
            }
        }
        this.state.newPanels.forEach(function item(b, index) {
            if (index === newId) {
                indexNew = index;
            } else if (panels === newId) {
                indexNew = index;
                newId--;
            }
        });
        this.setState({ idCount: newId });
        this.setState({
            indexValue: indexNew
        });
        this.setState({ newPanels: [] });
        for (var i = 0; i < indexNew; i++) {
            if (this.state.newPanels.length > 0) {
                extraPanel.push(<ExpansionPanel showExpansionGap height={25} onExpand={this.toggle} onCollapse={this.toggle}>
                    <Item keypanels={this.state.renderBackPanels[i]} id={i} key="0" onDelete={this.deleteHandler} isOpen="true"
                        headers={this.props.renderHeaders[i]} disableBtn="false" onBack={this.onBackClick}
                        buttonLabel={this.props.buttonLabel[i]} defaultOpen
                    />
                </ExpansionPanel>);
            } else {
                extraPanel.push(<ExpansionPanel showExpansionGap height={25} onExpand={this.toggle} onCollapse={this.toggle}>
                    <Item keypanels={this.state.renderBackPanels[0]} id="0" key="0" onDelete={this.deleteHandler}
                        isOpen="true" headers={this.props.renderHeaders[0]} disableBtn="false" onBack={this.onBackClick}
                        buttonLabel={this.props.buttonLabel[0]} defaultOpen
                    />
                </ExpansionPanel>);
            }
        }
        this.setState({ newPanels: extraPanel });
    };

    getNewPanelsWithoutBackClicked=(newIndex, newRenderPanel, endExpansion) => {
        newRenderPanel =[];
        if (this.state.renderNextPanels[newIndex] !== 'undefined' && !endExpansion && newIndex + 1 < this.state.renderNextPanels.length) {
            var newItem = newIndex + 1;
            for (var k = 0; k <= newItem; k++) {
                if (k === 0 || k === (newItem+1)) {
                    newRenderPanel.push(<ExpansionPanel showExpansionGap height={25} onExpand={this.toggle} onCollapse={this.toggle}>
                        <Item keypanels={this.state.renderNextPanels[k]} id={k} key="0"
                            onDelete={this.deleteHandler} isOpen="true" headers={this.props.renderHeaders[k]} disableBtn="false" onBack={this.onBackClick}
                            buttonLabel={this.props.buttonLabel[k]} defaultOpen
                        />
                    </ExpansionPanel>);
                } else if ((this.state.renderNextPanels.length-1)===newItem) {
                    newRenderPanel.push(<ExpansionPanel showExpansionGap height={25} onExpand={this.toggle} onCollapse={this.toggle}>
                        <Item keypanels={this.state.renderNextPanels[k]} id={this.state.idCount} key="0"
                            onDelete={this.deleteHandler} isOpen="true" headers={this.props.renderHeaders[k]} disableBtn="false" onBack={this.onBackClick}
                            buttonLabel={this.props.buttonLabel[k]} defaultOpen
                        />
                    </ExpansionPanel>);
                } else {
                    newRenderPanel.push(<ExpansionPanel showExpansionGap height={25} onExpand={this.toggle} onCollapse={this.toggle}>
                        <Item keypanels={this.state.renderNextPanels[k]} id={k} key="0"
                            onDelete={this.deleteHandler} isOpen="true" headers={this.props.renderHeaders[k]} disableBtn="false" onBack={this.onBackClick}
                            buttonLabel={this.props.buttonLabel[k]} defaultOpen
                        />
                    </ExpansionPanel>);
                }
            }
        }
        return newRenderPanel;
    }

    getNewPanelsWhenBackClicked = (newIndex, newRenderPanel) => {
        newRenderPanel =[];
        for (var j = 0; j <= newIndex; j++) {
            if (j === 0 || j === (newIndex - 1)) {
                newRenderPanel.push(<ExpansionPanel showExpansionGap height={25} onExpand={this.toggle} onCollapse={this.toggle}>
                    <Item keypanels={this.state.renderNextPanels[j]} id="0" key="0" onDelete={this.deleteHandler}
                        isOpen="true" headers={this.props.renderHeaders[j]} disableBtn="false" onBack={this.onBackClick}
                        buttonLabel={this.props.buttonLabel[j]} defaultOpen
                    />
                </ExpansionPanel>);
            } else if ((this.state.renderNextPanels.length-1)===newIndex) {
                newRenderPanel.push(<ExpansionPanel showExpansionGap height={25} onExpand={this.toggle} onCollapse={this.toggle}>
                    <Item keypanels={this.state.renderNextPanels[newIndex]} id={this.state.idCount} key="0"
                        onDelete={this.deleteHandler} isOpen="true" headers={this.props.renderHeaders[newIndex]} disableBtn="false" onBack={this.onBackClick}
                        buttonLabel={this.props.buttonLabel[newIndex]}  defaultOpen
                    />
                </ExpansionPanel>);
            } else {
                newRenderPanel.push(<ExpansionPanel showExpansionGap height={25} onExpand={this.toggle} onCollapse={this.toggle}>
                    <Item keypanels={this.state.renderNextPanels[newIndex]} id={this.state.idCount} key="0"
                        onDelete={this.deleteHandler} isOpen="true" headers={this.props.renderHeaders[newIndex]} disableBtn="false" onBack={this.onBackClick}
                        buttonLabel={this.props.buttonLabel[newIndex]} defaultOpen
                    />
                </ExpansionPanel>);
            }
        }
        return newRenderPanel;

    }

    deleteHandler = () => {
        if (this.state.renderNextPanels.length > 0 && this.state.renderNextPanels !== 'undefined') {
            var newVal = this.state.idCount;
            var newRenderPanel=[];
            newVal++;
            this.setState({
                childPanels: this.state.renderNextPanels,
            });
            this.setState({
                isButtonDisabled: false
            });
            var count = newVal;
            var toRender = false;
            var newIndex = '';
            this.state.renderNextPanels.forEach(function item(value, index) {
                if ((index + 1) === count) {
                    toRender = true;
                    newIndex = index;
                }
            });
            if (toRender) {
                var endExpansion = false;
                if (count === this.state.renderNextPanels.length) {
                    endExpansion = true;
                }
                if (this.state.renderNextPanels[newIndex] !== 'undefined' && this.state.isBackClicked) {
                    newRenderPanel = this.getNewPanelsWhenBackClicked(newIndex, newRenderPanel);
                } else {
                    newRenderPanel = this.getNewPanelsWithoutBackClicked(newIndex, newRenderPanel, endExpansion);
                }
            }
            this.setState({
                newPanels: newRenderPanel
            });
            this.setState({ idCount: newVal });
        }
    }
    toggle = event => {
        const copyChildPanels = this.state.childPanels;
        copyChildPanels[event.value].isOpen = event.type === 'onExpand';
        this.setState({
            childPanels: copyChildPanels
        });
    }
    render() {
        return (
            <div>
                {this.state.newPanels}
            </div>

        );
    }
}
DynamicExpansionPanelContainer.propTypes={
    renderPanels: PropTypes.array,
    renderHeaders: PropTypes.array,
    buttonLabel: PropTypes.array
};