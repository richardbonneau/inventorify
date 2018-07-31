import React, { Component } from 'react';

import { Layout, Stack, Card, Checkbox, Button } from '@shopify/polaris';

export default class ListedProduct extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checked: false,
            testObj: { test: "string" }
        }
    }

    handleChange = () => {
        if (this.state.checked === false) {
            this.setState({ checked: true })
        } else if (this.state.checked === true) {
            this.setState({ checked: false })
        }
    }

    render() {
        return (
            <li class="productButton">
                <Button
                    id={this.props.id}
                    onClick={this.handleChange}
                >
                    {this.props.title}

                    <Checkbox
                        checked={this.state.checked}
                    />
                </Button>
            </li>
        )
    }
}
