import React from 'react';
import { shallow } from 'enzyme';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Main from './Main'

configure({ adapter: new Adapter() });


it("works", () => {
    expect(1 + 1).toBe(2)
})

it("first test", () => {
    const wrapper = shallow(<Main />)
    console.log(wrapper.debug())

})