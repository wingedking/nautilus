import React from 'react';
import SwarmDeployment from '../src/renderer/components/SwarmDeployment';
import { shallow, mount } from 'enzyme';

describe('Swarm Deployment component', () => {
  const props = {
    currentFilePath: 'User/project_name/docker-compose.yml',
  };
  const mockFunction = jest.fn(() => {});
  const wrapper = shallow(<SwarmDeployment {...props} />);

  describe('Component content', () => {
    it('should have a button with className `deploy-btn`', () => {
      let calls = mockFunction.mock.calls.length;
      expect(wrapper.find('deploy-btn')).toHaveLength(1);
      wrapper.find('deploy-btn').simulate('click');
      expect(mockFunction.mock.calls.length).toEqual(calls + 1);
    });

    it('should have a pop-up box that contains further actions/information', () => {
      expect(wrapper.find('popup-div')).toHaveLength(1);
    });

    it('allows user to enter a name for their stack(s)', () => {
      expect(wrapper.find('input')).toHaveLength(1);
    });
  });

  describe('handling of state', () => {
    // check that state is being updated correctly and contains the right information
    // make sure currentFile can be accessed in component
    // test for success/error
  });
});
