import React, { Component } from 'react';
import store from "../store/index"
import { addColorVariantId, removeColorVariantId, selectEveryVariants } from "../actions/index"

import { Layout, Stack, Card, Checkbox, Button } from '@shopify/polaris';


export default class SelectEveryVariants extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checked: false
        }
    }

    componentDidMount = () => {
        //console.log(this.props.arrVariantId, this.props.arrInvId)
    }

    handleChange = () => {
        if (this.state.checked === false) {
            store.dispatch(selectEveryVariants(true))
            this.setState({ checked: true });

        } else if (this.state.checked === true) {
            store.dispatch(selectEveryVariants(false))
            this.setState({ checked: false });
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
