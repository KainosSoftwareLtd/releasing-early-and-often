const sinon = require('sinon');
const { expect } = require('chai');
const controller = require('../../src/controllers/child');

function makeReqRes(method = 'GET') {
  const req = { method };
  const res = { render: sinon.stub(), redirect: sinon.stub() };
  return { req, res };
}

describe('ChildController', () => {
  it('getChildApplication renders page on GET', () => {
    const { req, res } = makeReqRes('GET');

    controller.getChildApplication(req, res);

    expect(res.render).to.have.been.calledWith('pages/child-application.html', { pageTitle: 'Child Application' });
  });

  it('getChildApplication redirects on POST', () => {
    const { req, res } = makeReqRes('POST');

    controller.getChildApplication(req, res);

    expect(res.redirect).to.have.been.calledWith('/previous-passport');
  });

  it('getChildUnavailable renders unavailable page', () => {
    const { req, res } = makeReqRes('GET');

    controller.getChildUnavailable(req, res);

    expect(res.render).to.have.been.calledWith('pages/child-unavailable.html', { pageTitle: 'Service Unavailable' });
  });
});
