import React, { Component } from 'react';

import { connect } from "react-redux"
import store from "../store/index"
import { addColorVariantId, removeColorVariantId } from "../actions/index"

import { Layout, Stack, Card, Checkbox, Button } from '@shopify/polaris';

class SelectColorVariants extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checked: false
        }
    }

    componentDidUpdate = (prevProps) => {
        if (this.props.selectEveryColor !== prevProps.selectEveryColor) {

            if (this.props.selectEveryColor[this.props.title] === true) {
                store.dispatch(addColorVariantId(this.props.arrVariantId))
                this.setState({ checked: true });
            } else {
                store.dispatch(removeColorVariantId(this.props.arrVariantId))
                this.setState({ checked: false });
            }
            console.log("props", this.props.selectEveryColor)
        }
    }

    handleChange = () => {
        if (this.state.checked === false) {
            store.dispatch(addColorVariantId(this.props.arrVariantId))
            this.setState({ checked: true });
        } else if (this.state.checked === true) {
            store.dispatch(removeColorVariantId(this.props.arrVariantId))
            this.setState({ checked: false });
        }
    }

    render() {
        return (
            <Button onClick={this.handleChange} plain={true} >
                <Checkbox checked={this.state.checked} />
                Sélectionner {this.props.title}
            </Button>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        selectEveryColor: state.selectEveryColor
    }
}

export default connect(mapStateToProps)(SelectColorVariants)
