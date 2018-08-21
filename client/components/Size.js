import React, { Component } from 'react';


import { Layout, Stack, Card, Checkbox, Button } from '@shopify/polaris';

export default class Size extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checked: false
        }
    }

    componentDidMount = () => {

    }

    handleChange = () => {
        if (this.state.checked === false) {
            this.setState({ checked: true })
        } else if (this.state.checked === true) {
            this.setState({ checked: false })
        }
    }

    render() {
        console.log("size compo", this.props.variantId)
        return (
            <Button onClick={this.handleChange}>
                {this.props.title}
                <Checkbox checked={this.state.checked} />
            </Button>
        )
    }
}
