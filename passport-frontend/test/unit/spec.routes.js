const { expect } = require('chai');
const sinon = require('sinon');

describe('Routes', () => {
  it('root route redirects to /date-of-birth', () => {
    const router = require('../../src/routes');
    // Find the layer for '/'
    const layer = router.stack.find(l => l.route && l.route.path === '/' && l.route.methods.get);
    expect(layer).to.exist;
    const handler = layer.route.stack[0].handle;

    const req = {};
    const res = { redirect: sinon.stub() };

    handler(req, res);

    expect(res.redirect).to.have.been.calledWith('/date-of-birth');
  });
});
