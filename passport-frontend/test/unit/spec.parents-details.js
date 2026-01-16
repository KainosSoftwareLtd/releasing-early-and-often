const sinon = require('sinon');
const { expect } = require('chai');
const controller = require('../../src/controllers/parents-details');

function makeReqRes(session = {}) {
  const req = { session, body: {} };
  const res = { render: sinon.stub(), redirect: sinon.stub() };
  return { req, res };
}

describe('ParentsDetailsController', () => {
  it('getParentsDetails renders with empty values when no session data', () => {
    const { req, res } = makeReqRes({});

    controller.getParentsDetails(req, res);

    expect(res.render).to.have.been.calledWith('pages/parents-details.html', sinon.match({
      pageTitle: 'Parent or guardian details',
      values: {},
      errors: {}
    }));
  });
  it('getParentsDetails renders with session values and errors', () => {
    const { req, res } = makeReqRes({
      parentsDetails: { parent1FullName: 'Jane', parent1Contact: 'jane@example.com' },
      errors: { parentsDetails: { parent1FullName: 'Enter name' } }
    });

    controller.getParentsDetails(req, res);

    expect(res.render).to.have.been.calledWith('pages/parents-details.html', sinon.match({
      pageTitle: 'Parent or guardian details',
      values: { parent1FullName: 'Jane', parent1Contact: 'jane@example.com' },
      errors: { parent1FullName: 'Enter name' }
    }));
    // errors for parentsDetails cleared after render
    expect(req.session.errors).to.equal(undefined);
  });

  it('postParentsDetails stores details and redirects on valid input', () => {
    const { req, res } = makeReqRes({});
    req.body = { 
      parent1FullName: ' Jane Smith ', 
      parent1Contact: ' jane@example.com ',
      parent2FullName: ' John Smith ',
      parent2Contact: ' john@example.com '
    };

    controller.postParentsDetails(req, res);

    expect(req.session.parentsDetails).to.deep.equal({ 
      parent1FullName: 'Jane Smith', 
      parent1Contact: 'jane@example.com',
      parent2FullName: 'John Smith',
      parent2Contact: 'john@example.com'
    });
    expect(res.redirect).to.have.been.calledWith('/previous-passport');
  });

  it('postParentsDetails sets errors and redirects back on invalid input', () => {
    const { req, res } = makeReqRes({});
    req.body = { parent1FullName: '', parent1Contact: '' };

    controller.postParentsDetails(req, res);

    expect(req.session.errors.parentsDetails).to.have.property('parent1FullName');
    expect(req.session.errors.parentsDetails).to.have.property('parent1Contact');
    expect(res.redirect).to.have.been.calledWith('/parents-details');
  });

  it('postParentsDetails handles empty parent2 fields correctly', () => {
    const { req, res } = makeReqRes({});
    req.body = { 
      parent1FullName: 'Jane Smith', 
      parent1Contact: 'jane@example.com',
      parent2FullName: '',
      parent2Contact: ''
    };

    controller.postParentsDetails(req, res);

    expect(req.session.parentsDetails).to.deep.equal({ 
      parent1FullName: 'Jane Smith', 
      parent1Contact: 'jane@example.com',
      parent2FullName: '',
      parent2Contact: ''
    });
    expect(res.redirect).to.have.been.calledWith('/previous-passport');
  });

  it('postParentsDetails handles undefined parent2 fields correctly', () => {
    const { req, res } = makeReqRes({});
    req.body = { 
      parent1FullName: 'Jane Smith', 
      parent1Contact: 'jane@example.com'
    };

    controller.postParentsDetails(req, res);

    expect(req.session.parentsDetails).to.deep.equal({ 
      parent1FullName: 'Jane Smith', 
      parent1Contact: 'jane@example.com',
      parent2FullName: '',
      parent2Contact: ''
    });
    expect(res.redirect).to.have.been.calledWith('/previous-passport');
  });

  it('getParentsDetails clears all errors when parentsDetails is the only error', () => {
    const { req, res } = makeReqRes({
      parentsDetails: {},
      errors: { parentsDetails: { parent1FullName: 'Error' } }
    });

    controller.getParentsDetails(req, res);

    expect(req.session.errors).to.equal(undefined);
  });

  it('getParentsDetails preserves other errors when clearing parentsDetails errors', () => {
    const { req, res } = makeReqRes({
      parentsDetails: {},
      errors: { 
        parentsDetails: { parent1FullName: 'Error' },
        otherField: { someError: 'Other error' }
      }
    });

    controller.getParentsDetails(req, res);

    expect(req.session.errors).to.not.have.property('parentsDetails');
    expect(req.session.errors).to.have.property('otherField');
  });

  it('getChildUnavailable renders service unavailable', () => {
    const { req, res } = makeReqRes({});

    controller.getChildUnavailable(req, res);

    expect(res.render).to.have.been.calledWith('pages/child-unavailable.html', { pageTitle: 'Service Unavailable' });
  });
});
