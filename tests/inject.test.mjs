import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const source = readFileSync(new URL("../src/inject.js", import.meta.url), "utf8");

function load(stripSetting = "on") {
  const messages = [];
  const context = {
    document: { documentElement: { dataset: { ytabStrip: stripSetting } } },
    postMessage: (msg) => messages.push(msg),
  };
  context.window = context;
  vm.createContext(context);
  vm.runInContext(source, context);
  return { context, messages, parse: (s) => vm.runInContext(`JSON.parse(${JSON.stringify(s)})`, context) };
}

const playerResponse = {
  videoDetails: { videoId: "abc" },
  adPlacements: [{}],
  playerAds: [{}],
  adSlots: [{}],
};

test("JSON.parse removes ad fields and keeps the rest", () => {
  const { parse, messages } = load();
  const out = parse(JSON.stringify(playerResponse));
  assert.equal(out.videoDetails.videoId, "abc");
  assert.equal(out.adPlacements, undefined);
  assert.equal(out.playerAds, undefined);
  assert.equal(out.adSlots, undefined);
  assert.equal(messages.length, 1);
});

test("strips ads nested under playerResponse", () => {
  const { parse } = load();
  const out = parse(JSON.stringify({ playerResponse }));
  assert.equal(out.playerResponse.adPlacements, undefined);
  assert.equal(out.playerResponse.videoDetails.videoId, "abc");
});

test("strips ads from array responses", () => {
  const { parse } = load();
  const out = parse(JSON.stringify([{ page: "watch" }, { playerResponse }]));
  assert.equal(out[1].playerResponse.adPlacements, undefined);
  assert.equal(out[1].playerResponse.videoDetails.videoId, "abc");
  assert.equal(out[0].page, "watch");
});

test("ytInitialPlayerResponse is stripped when YouTube assigns it", () => {
  const { context } = load();
  context.ytInitialPlayerResponse = structuredClone(playerResponse);
  assert.equal(context.ytInitialPlayerResponse.adPlacements, undefined);
});

test("does nothing when the setting is off", () => {
  const { parse, messages } = load("off");
  const out = parse(JSON.stringify(playerResponse));
  assert.ok(out.adPlacements);
  assert.equal(messages.length, 0);
});

test("leaves non-object JSON alone", () => {
  const { parse } = load();
  assert.equal(parse("42"), 42);
  assert.equal(parse('"hi"'), "hi");
  assert.equal(parse("null"), null);
});
