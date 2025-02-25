import { mount } from 'cypress/react18';
import { toMatchSnapshot, toBeTruthy, toHaveBeenCalledWith } from 'jest';

declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
      clickOutside: () => void;
      beforeEachInit: () => void;
      afterEachInit: () => void;
    }
  }
  namespace Chai {
    interface Assertion {
      toMatchSnapshot: typeof toMatchSnapshot;
      toBeTruthy: typeof toBeTruthy;
      toHaveBeenCalledWith: typeof toHaveBeenCalledWith;
    }
  }
}
