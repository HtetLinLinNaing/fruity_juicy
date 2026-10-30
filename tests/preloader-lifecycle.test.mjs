import assert from "node:assert/strict";
import { test } from "node:test";
import { createLoadingLifecycle } from "../src/components/preloader-lifecycle.ts";

function setup(t, reducedMotion = false) {
  t.mock.timers.enable({ apis: ["setTimeout", "Date"], now: 0 });
  let calls = 0;
  const lifecycle = createLoadingLifecycle({
    reducedMotion,
    onDismiss: () => { calls += 1; },
  });
  t.after(() => lifecycle.dispose());
  return { lifecycle, count: () => calls, tick: ms => t.mock.timers.tick(ms) };
}

test("ready assets wait until the 1200ms minimum", t => {
  const { lifecycle, count, tick } = setup(t);
  lifecycle.ready();
  tick(1199);
  assert.equal(count(), 0);
  tick(1);
  assert.equal(count(), 1);
});

test("assets ready after the minimum dismiss immediately", t => {
  const { lifecycle, count, tick } = setup(t);
  tick(3000);
  assert.equal(count(), 0);
  lifecycle.ready();
  assert.equal(count(), 1);
});

test("unsettled assets cannot block the 8000ms maximum", t => {
  const { count, tick } = setup(t);
  tick(7999);
  assert.equal(count(), 0);
  tick(1);
  assert.equal(count(), 1);
});

test("readiness and deadline signals dismiss only once", t => {
  const { lifecycle, count, tick } = setup(t);
  lifecycle.ready();
  lifecycle.ready();
  tick(1200);
  lifecycle.ready();
  lifecycle.setReducedMotion(true);
  tick(10000);
  assert.equal(count(), 1);
});

test("reduced motion skips the minimum once ready", t => {
  const { lifecycle, count } = setup(t, true);
  assert.equal(count(), 0);
  lifecycle.ready();
  assert.equal(count(), 1);
});

test("reduced motion still waits for assets or the maximum", t => {
  const { count, tick } = setup(t, true);
  tick(7999);
  assert.equal(count(), 0);
  tick(1);
  assert.equal(count(), 1);
});

test("enabling reduced motion releases an already ready loader", t => {
  const { lifecycle, count, tick } = setup(t);
  lifecycle.ready();
  tick(100);
  lifecycle.setReducedMotion(true);
  assert.equal(count(), 1);
  tick(10000);
  assert.equal(count(), 1);
});

test("disabling reduced motion before readiness retains the minimum", t => {
  const { lifecycle, count, tick } = setup(t, true);
  lifecycle.setReducedMotion(false);
  lifecycle.ready();
  tick(1199);
  assert.equal(count(), 0);
  tick(1);
  assert.equal(count(), 1);
});

test("disposal cancels the deadline and ignores future signals", t => {
  const { lifecycle, count, tick } = setup(t);
  lifecycle.dispose();
  lifecycle.ready();
  lifecycle.setReducedMotion(true);
  tick(10000);
  assert.equal(count(), 0);
});

test("disposal cancels an already scheduled minimum wait", t => {
  const { lifecycle, count, tick } = setup(t);
  lifecycle.ready();
  tick(100);
  lifecycle.dispose();
  tick(10000);
  assert.equal(count(), 0);
});
