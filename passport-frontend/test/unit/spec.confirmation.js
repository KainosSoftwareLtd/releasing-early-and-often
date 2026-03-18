const sinon = require('sinon');
const { expect } = require('chai');
const { getConfirmation } = require('../../src/controllers/confirmation');

describe('ConfirmationController', () => {
  it('renders with session reference number and clears session', () => {
    const destroySpy = sinon.spy();
    const req = { session: { referenceNumber: 'APP-999' , foo: 'bar', destroy: destroySpy } };
    const res = { render: sinon.stub() };

    getConfirmation(req, res);

    expect(res.render).to.have.been.calledWith('pages/confirmation.html', { pageTitle: 'Application complete', referenceNumber: 'APP-999' });
    expect(destroySpy).to.have.been.calledOnce;
  });

  it('renders with fallback reference number when missing', () => {
    const destroySpy = sinon.spy();
    const req = { session: { destroy: destroySpy } };
    const res = { render: sinon.stub() };

    getConfirmation(req, res);

    expect(res.render).to.have.been.calledWith('pages/confirmation.html', { pageTitle: 'Application complete', referenceNumber: 'HDJ2123F' });
  });
});
