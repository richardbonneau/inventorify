import React, { Component } from 'react';

import store from "../store/index"
import { connect } from "react-redux"
import { addAllVariants, removeAllVariants } from "../actions/index"

import { Layout, Stack, Card, Checkbox, Button } from '@shopify/polaris';

class SelectAllVariants extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checked: false
        }
    }

    componentDidUpdate = (prevProps) => {
        if (this.props.selectEveryVariants !== prevProps.selectEveryVariants) {
            if (this.props.selectEveryVariants === true) {
                store.dispatch(addAllVariants(this.props.productId))
                this.setState({ checked: true })
            } else {
                store.dispatch(removeAllVariants(this.props.productId))
                this.setState({ checked: false })
            }
        }
    }

    handleChange = () => {
        if (this.state.checked === false) {
            store.dispatch(addAllVariants(this.props.productId))
            this.setState({ checked: true })

        } else if (this.state.checked === true) {
            store.dispatch(removeAllVariants(this.props.productId))
            this.setState({ checked: false })
        }
    }

    render() {
        return (
            <Button onClick={this.handleChange} plain={true} >
                <Checkbox checked={this.state.checked} />
                Tout sélectionner
            </Button>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        selectEveryVariants: state.selectEveryVariants
    }
}

export default connect(mapStateToProps)(SelectAllVariants)