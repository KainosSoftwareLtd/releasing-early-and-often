const sinon = require('sinon');
const configService = require('../../src/services/config');
const {
  getParentsDetails,
  postParentsDetails
} = require('../../src/controllers/parents-details');

describe('ParentsDetailsController', () => {
  let req;
  let res;

  beforeEach(() => {
    sinon.stub(configService, 'getConfig').returns({
      featureFlags: {
        enabledChildRenewals: true,
        enableBackendServiceCalls: true
      },
      backend: {
        apiUrl: 'http://localhost:8080/api'
      }
    });
    req = {
      session: {
        dateOfBirth: { day: '1', month: '1', year: `${new Date().getFullYear() - 10}` }
      },
      body: {}
    };
    res = {
      render: sinon.stub(),
      redirect: sinon.stub()
    };
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should render parent details page with session values', () => {
    req.session.parentDetails = {
      parent1FullName: 'Alex Example',
      parent1Contact: 'alex@example.com'
    };

    getParentsDetails(req, res);

    expect(res.render).to.have.been.calledWith('pages/parents-details.html', {
      pageTitle: 'Parent details',
      values: {
        parent1FullName: 'Alex Example',
        parent1Contact: 'alex@example.com'
      },
      errors: {}
    });
  });

  it('should redirect to start when child journey is disabled', () => {
    configService.getConfig.returns({
      featureFlags: {
        enabledChildRenewals: false,
        enableBackendServiceCalls: true
      },
      backend: {
        apiUrl: 'http://localhost:8080/api'
      }
    });

    getParentsDetails(req, res);

    expect(res.redirect).to.have.been.calledWith('/date-of-birth');
  });

  it('should redirect back with errors for invalid parent details', () => {
    req.body = {
      parent1FullName: '',
      parent1Contact: 'not-an-email',
      parent2FullName: 'Sam Example',
      parent2Contact: ''
    };

    postParentsDetails(req, res);

    expect(req.session.errors.parent1FullName).to.equal('Enter the first parent full name');
    expect(req.session.errors.parent1Contact).to.equal('Enter a valid first parent email address');
    expect(req.session.errors.parent2Contact).to.equal('Enter the second parent email address');
    expect(res.redirect).to.have.been.calledWith('/parents-details');
  });

  it('should store valid parent details and continue', () => {
    req.body = {
      parent1FullName: 'Alex Example',
      parent1Contact: 'alex@example.com',
      parent2FullName: 'Sam Example',
      parent2Contact: 'sam@example.com'
    };

    postParentsDetails(req, res);

    expect(req.session.parentDetails).to.deep.equal({
      parent1FullName: 'Alex Example',
      parent1Contact: 'alex@example.com',
      parent2FullName: 'Sam Example',
      parent2Contact: 'sam@example.com'
    });
    expect(res.redirect).to.have.been.calledWith('/previous-passport');
  });
});