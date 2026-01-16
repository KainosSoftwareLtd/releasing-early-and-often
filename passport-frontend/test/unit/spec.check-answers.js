const sinon = require('sinon');
const { expect } = require('chai');
const axios = require('axios');

// System under test
const checkAnswersController = require('../../src/controllers/check-answers');
const routes = require('../../src/routes');
const config = require('../../config/config.json');

function makeReqRes(overrides = {}) {
  const req = {
    session: {
      dateOfBirth: { day: '01', month: '02', year: '2010' },
      previousPassport: 'no',
      address: {
        addressLine1: '123 High St',
        addressLine2: 'Flat 4',
        townCity: 'Belfast',
        postcode: 'BT1 1AA'
      },
      ...overrides.session
    },
    ...overrides.req
  };

  const res = {
    redirect: sinon.spy(),
    ...overrides.res
  };

  return { req, res };
}

describe('check-answers controller', () => {
  let axiosStub;
  let originalFlags;

  beforeEach(() => {
    // Save and mutate flags per test
    originalFlags = JSON.parse(JSON.stringify(config.featureFlags));
    axiosStub = sinon.stub(axios, 'post');
  });

  afterEach(() => {
    // Restore axios and feature flags
    axiosStub.restore();
    config.featureFlags.enableChildRenewals = originalFlags.enableChildRenewals;
    config.featureFlags.enableBackendServiceCalls = originalFlags.enableBackendServiceCalls;
  });

  it('includes parent fields when child renewals flag is enabled', async () => {
    config.featureFlags.enableChildRenewals = true;
    config.featureFlags.enableBackendServiceCalls = true;

    const { req, res } = makeReqRes({
      session: {
        parentsDetails: { 
          parent1FullName: 'Jane Smith', 
          parent1Contact: 'jane.smith@example.com',
          parent2FullName: 'John Smith',
          parent2Contact: 'john.smith@example.com'
        }
      }
    });

    axiosStub.resolves({ data: { applicationId: 'APP-123' } });

    await checkAnswersController.postCheckAnswers(req, res);

    expect(axiosStub.calledOnce).to.equal(true);
    const [url, payload] = axiosStub.firstCall.args;
    expect(url).to.equal(`${config.backend.apiUrl}/applications`);

    expect(payload).to.include({
      dateOfBirth: '2010-02-01',
      previousPassport: 'no',
      addressLine1: '123 High St',
      addressLine2: 'Flat 4',
      townCity: 'Belfast',
      postcode: 'BT1 1AA'
    });
    expect(payload).to.have.property('parent1FullName', 'Jane Smith');
    expect(payload).to.have.property('parent1Contact', 'jane.smith@example.com');
    expect(payload).to.have.property('parent2FullName', 'John Smith');
    expect(payload).to.have.property('parent2Contact', 'john.smith@example.com');

    expect(req.session.referenceNumber).to.equal('APP-123');
    expect(res.redirect.calledWith('/confirmation')).to.equal(true);
  });

  it('includes only parent1 when parent2 is not provided', async () => {
    config.featureFlags.enableChildRenewals = true;
    config.featureFlags.enableBackendServiceCalls = true;

    const { req, res } = makeReqRes({
      session: {
        parentsDetails: { 
          parent1FullName: 'Jane Smith', 
          parent1Contact: 'jane.smith@example.com'
        }
      }
    });

    axiosStub.resolves({ data: { applicationId: 'APP-789' } });

    await checkAnswersController.postCheckAnswers(req, res);

    const [, payload] = axiosStub.firstCall.args;
    expect(payload).to.have.property('parent1FullName', 'Jane Smith');
    expect(payload).to.have.property('parent1Contact', 'jane.smith@example.com');
    expect(payload).to.not.have.property('parent2FullName');
    expect(payload).to.not.have.property('parent2Contact');

    expect(req.session.referenceNumber).to.equal('APP-789');
    expect(res.redirect.calledWith('/confirmation')).to.equal(true);
  });

  it('does not include parent fields when child renewals flag is disabled', async () => {
    config.featureFlags.enableChildRenewals = false;
    config.featureFlags.enableBackendServiceCalls = true;

    const { req, res } = makeReqRes({
      session: {
        parentsDetails: { parent1FullName: 'Jane Smith', parent1Contact: 'jane@example.com' }
      }
    });

    axiosStub.resolves({ data: { applicationId: 'APP-456' } });

    await checkAnswersController.postCheckAnswers(req, res);

    const [, payload] = axiosStub.firstCall.args;
    expect(payload).to.not.have.property('parent1FullName');
    expect(payload).to.not.have.property('parent1Contact');
    expect(payload).to.not.have.property('parent2FullName');
    expect(payload).to.not.have.property('parent2Contact');

    expect(req.session.referenceNumber).to.equal('APP-456');
    expect(res.redirect.calledWith('/confirmation')).to.equal(true);
  });

  it('skips backend call when backend service flag is disabled', async () => {
    config.featureFlags.enableBackendServiceCalls = false;

    const { req, res } = makeReqRes();

    await checkAnswersController.postCheckAnswers(req, res);

    expect(axiosStub.called).to.equal(false);
    expect(req.session.referenceNumber).to.be.a('string');
    expect(req.session.referenceNumber.startsWith('REF-')).to.equal(true);
    expect(res.redirect.calledWith('/confirmation')).to.equal(true);
  });

  it('renders check answers page with parents details row when present', () => {
    const getConfig = require('../../config/config.json');
    const original = getConfig.featureFlags.enableChildRenewals;
    getConfig.featureFlags.enableChildRenewals = true;

    const req = {
      session: {
        dateOfBirth: { day: '01', month: '02', year: '2010' },
        previousPassport: 'no',
        address: { addressLine1: '1', addressLine2: '', townCity: 'A', postcode: 'AA1 1AA' },
        parentsDetails: { parent1FullName: 'Jane Smith', parent1Contact: 'jane@example.com' }
      }
    };
    const res = { render: sinon.stub(), redirect: sinon.stub() };

    checkAnswersController.getCheckAnswers(req, res);

    const [, model] = res.render.firstCall.args;
    expect(model.pageTitle).to.equal('Check your answers');
    expect(model.rows.some(r => r.key.text === 'Parent or guardian details')).to.equal(true);

    getConfig.featureFlags.enableChildRenewals = original;
  });

  it('renders check answers page with both parents when parent2 is provided', () => {
    const getConfig = require('../../config/config.json');
    const original = getConfig.featureFlags.enableChildRenewals;
    getConfig.featureFlags.enableChildRenewals = true;

    const req = {
      session: {
        dateOfBirth: { day: '01', month: '02', year: '2010' },
        previousPassport: 'no',
        address: { addressLine1: '1', addressLine2: '', townCity: 'A', postcode: 'AA1 1AA' },
        parentsDetails: { 
          parent1FullName: 'Jane Smith', 
          parent1Contact: 'jane@example.com',
          parent2FullName: 'John Smith',
          parent2Contact: 'john@example.com'
        }
      }
    };
    const res = { render: sinon.stub(), redirect: sinon.stub() };

    checkAnswersController.getCheckAnswers(req, res);

    const [, model] = res.render.firstCall.args;
    const parentsRow = model.rows.find(r => r.key.text === 'Parent or guardian details');
    expect(parentsRow).to.exist;
    expect(parentsRow.value.html).to.contain('Parent 1:');
    expect(parentsRow.value.html).to.contain('Jane Smith');
    expect(parentsRow.value.html).to.contain('Parent 2:');
    expect(parentsRow.value.html).to.contain('John Smith');

    getConfig.featureFlags.enableChildRenewals = original;
  });

  it('renders address with addressLine2 when provided', () => {
    const getConfig = require('../../config/config.json');
    const original = getConfig.featureFlags.enableChildRenewals;
    getConfig.featureFlags.enableChildRenewals = false; // irrelevant for this check

    const req = {
      session: {
        dateOfBirth: { day: '01', month: '02', year: '2010' },
        previousPassport: 'no',
        address: { addressLine1: 'L1', addressLine2: 'L2', townCity: 'City', postcode: 'AA1 1AA' }
      }
    };
    const res = { render: sinon.stub(), redirect: sinon.stub() };

    checkAnswersController.getCheckAnswers(req, res);

    const [, model] = res.render.firstCall.args;
    const addressRow = model.rows.find(r => r.key.text === 'Address');
    expect(addressRow.value.html).to.contain('L2<br>');

    getConfig.featureFlags.enableChildRenewals = original;
  });

  it('does not include parents details row when flag disabled', () => {
    const getConfig = require('../../config/config.json');
    const original = getConfig.featureFlags.enableChildRenewals;
    getConfig.featureFlags.enableChildRenewals = false;

    const req = {
      session: {
        dateOfBirth: { day: '01', month: '02', year: '2010' },
        previousPassport: 'no',
        address: { addressLine1: '1', addressLine2: '', townCity: 'A', postcode: 'AA1 1AA' },
        parentsDetails: { parent1FullName: 'Jane Smith', parent1Contact: 'jane@example.com' }
      }
    };
    const res = { render: sinon.stub(), redirect: sinon.stub() };

    checkAnswersController.getCheckAnswers(req, res);

    const [, model] = res.render.firstCall.args;
    expect(model.rows.some(r => r.key.text === 'Parent or guardian details')).to.equal(false);

    getConfig.featureFlags.enableChildRenewals = original;
  });

  it('displays "Yes" for previous passport when value is yes', () => {
    const req = {
      session: {
        dateOfBirth: { day: '01', month: '02', year: '1990' },
        previousPassport: 'yes',
        address: { addressLine1: '1', addressLine2: '', townCity: 'A', postcode: 'AA1 1AA' }
      }
    };
    const res = { render: sinon.stub(), redirect: sinon.stub() };

    checkAnswersController.getCheckAnswers(req, res);

    const [, model] = res.render.firstCall.args;
    const prevRow = model.rows.find(r => r.key.text === 'Previous UK passport');
    expect(prevRow.value.text).to.equal('Yes');
  });

  it('redirects to start if required data missing', () => {
    const req = { session: {} };
    const res = { render: sinon.stub(), redirect: sinon.stub() };

    checkAnswersController.getCheckAnswers(req, res);

    expect(res.redirect).to.have.been.calledWith('/date-of-birth');
  });

  it('handles backend error by generating TEMP reference number', async () => {
    const getConfig = require('../../config/config.json');
    const original = getConfig.featureFlags.enableBackendServiceCalls;
    getConfig.featureFlags.enableBackendServiceCalls = true;

    const { req, res } = makeReqRes();
    axiosStub.rejects(new Error('network error'));

    await checkAnswersController.postCheckAnswers(req, res);

    expect(req.session.referenceNumber).to.match(/^TEMP-/);
    expect(res.redirect).to.have.been.calledWith('/confirmation');

    getConfig.featureFlags.enableBackendServiceCalls = original;
  });
});
