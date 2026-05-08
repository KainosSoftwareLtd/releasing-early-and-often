const sinon = require('sinon');
const axios = require('axios');
const configService = require('../../src/services/config');
const {
  getCheckAnswers,
  postCheckAnswers
} = require('../../src/controllers/check-answers');

describe('CheckAnswersController', () => {
  let req;
  let res;
  const baseConfig = {
    featureFlags: {
      enabledChildRenewals: false,
      enableBackendServiceCalls: true
    },
    backend: {
      apiUrl: 'http://localhost:8080/api'
    }
  };

  beforeEach(() => {
    sinon.stub(configService, 'getConfig').returns(baseConfig);

    req = {
      session: {
        dateOfBirth: { day: '15', month: '06', year: '1990' },
        previousPassport: 'yes',
        address: {
          addressLine1: '123 Main Street',
          addressLine2: 'Apt 4B',
          townCity: 'London',
          postcode: 'SW1A 1AA'
        }
      }
    };
    res = {
      render: sinon.stub(),
      redirect: sinon.stub()
    };
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should redirect child applications to parent details when required data is missing', () => {
    configService.getConfig.returns({
      ...baseConfig,
      featureFlags: {
        ...baseConfig.featureFlags,
        enabledChildRenewals: true
      }
    });
    req.session.dateOfBirth = { day: '1', month: '1', year: `${new Date().getFullYear() - 10}` };

    getCheckAnswers(req, res);

    expect(res.redirect).to.have.been.calledWith('/parents-details');
  });

  it('should post v1 payload and version header for the standard journey', async () => {
    const axiosPost = sinon.stub(axios, 'post').resolves({
      data: { applicationId: 'app-v1' }
    });

    await postCheckAnswers(req, res);

    expect(axiosPost).to.have.been.calledOnce;
    const [url, payload, options] = axiosPost.firstCall.args;
    expect(url).to.equal(`${baseConfig.backend.apiUrl}/applications`);
    expect(payload).to.deep.equal({
      dateOfBirth: '1990-06-15',
      previousPassport: 'yes',
      addressLine1: '123 Main Street',
      addressLine2: 'Apt 4B',
      townCity: 'London',
      postcode: 'SW1A 1AA'
    });
    expect(options.headers['X-API-Version']).to.equal('1.0');
    expect(req.session.referenceNumber).to.equal('app-v1');
    expect(res.redirect).to.have.been.calledWith('/confirmation');
  });

  it('should post v2 payload and version header for the child journey', async () => {
    configService.getConfig.returns({
      ...baseConfig,
      featureFlags: {
        ...baseConfig.featureFlags,
        enabledChildRenewals: true
      }
    });
    req.session.dateOfBirth = { day: '1', month: '1', year: `${new Date().getFullYear() - 10}` };
    req.session.parentDetails = {
      parent1FullName: 'Alex Example',
      parent1Contact: 'alex@example.com',
      parent2FullName: 'Sam Example',
      parent2Contact: 'sam@example.com'
    };

    const axiosPost = sinon.stub(axios, 'post').resolves({
      data: { applicationId: 'app-v2' }
    });

    await postCheckAnswers(req, res);

    expect(axiosPost).to.have.been.calledOnce;
    const [, payload, options] = axiosPost.firstCall.args;
    expect(payload).to.deep.equal({
      dateOfBirth: `${req.session.dateOfBirth.year}-01-01`,
      previousPassport: 'yes',
      addressLine1: '123 Main Street',
      addressLine2: 'Apt 4B',
      townCity: 'London',
      postcode: 'SW1A 1AA',
      parent1FullName: 'Alex Example',
      parent1Contact: 'alex@example.com',
      parent2FullName: 'Sam Example',
      parent2Contact: 'sam@example.com'
    });
    expect(options.headers['X-API-Version']).to.equal('2.0');
    expect(req.session.referenceNumber).to.equal('app-v2');
    expect(res.redirect).to.have.been.calledWith('/confirmation');
  });
});