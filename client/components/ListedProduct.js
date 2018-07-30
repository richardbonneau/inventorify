import React, { Component } from 'react';

import { Layout, Stack, Card, Checkbox, Button } from '@shopify/polaris';

export default class ListedProduct extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checked: false,
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
            <li  >
                <Button
                    id={this.props.id}
                    class="productButton"
                    clicked={this.props.clicked}
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
