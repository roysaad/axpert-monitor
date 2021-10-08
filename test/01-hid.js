const expect = require("chai").expect;
const sinon = require("sinon");
const HID = require("node-hid");
const AxpertUSB = require("../index");

describe("01 - hid", () => {
  it("should create an instance with default VID & PID", async () => {
    const hidStub = sinon.stub(HID, "HID").returns({ on: () => {} });
    new AxpertUSB();
    expect(hidStub.callCount).eql(1);
    expect(hidStub.args[0][0]).eql(1637);
    expect(hidStub.args[0][1]).eql(20833);
    hidStub.restore();
  });

  it("should create an instance with overwritten VID & PID", async () => {
    const VID = 1;
    const PID = 2;
    const hidStub = sinon.stub(HID, "HID").returns({ on: () => {} });
    new AxpertUSB(VID, PID);
    expect(hidStub.callCount).eql(1);
    expect(hidStub.args[0][0]).eql(VID);
    expect(hidStub.args[0][1]).eql(PID);
    hidStub.restore();
  });

  it("should throw if VID & PID is not found", async () => {
    const VID = 1;
    const PID = 2;
    try {
      new AxpertUSB(VID, PID);
      throw Error("unexpected");
    } catch (err) {
      expect(err.message).contains("cannot open device");
    }
  });

  it("should close HID on stop", async () => {
    const hidStub = sinon
      .stub(HID, "HID")
      .returns({ on: () => {}, close: () => {} });

    const axpert = new AxpertUSB();

    const closeSpy = sinon.spy(axpert.hid, "close");
    axpert.stop();

    expect(closeSpy.callCount).eql(1);
    closeSpy.restore();
    hidStub.restore();
  });
});