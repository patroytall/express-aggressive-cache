import { mock } from "jest-mock-extended";
import { expressAggressiveCache } from "./middleware";
import { Request } from "express";
import { GetCacheTag } from "./types";

let req: Request;
let res: any;
let next: any;

beforeEach(() => {
  req = mock<Request>();
  req.method = "GET";
  req.originalUrl = "http://domain.com";
  res = {};
  res.on = (_, handler) => {
    res.handler = handler;
  };
  res.setHeader = jest.fn();
  next = () => {
    res.handler();
  };
});

test("getCacheTag option is used", async () => {
  const getCacheTag: GetCacheTag = jest.fn().mockReturnValue("tag");

  const cache = expressAggressiveCache({ getCacheTag });
  await cache.middleware(req, res, next);

  expect(getCacheTag).toBeCalled();
});

test("true debug option results in console logging", async () => {
  // eslint-disable-next-line no-console
  console.log = jest.fn();
  const cache = expressAggressiveCache({ debug: true });
  await cache.middleware(req, res, next);
  // eslint-disable-next-line no-console
  expect(console.log).toBeCalled();
});

test("false debug option results in no console logging", async () => {
  // eslint-disable-next-line no-console
  console.log = jest.fn();
  const cache = expressAggressiveCache({ debug: false });
  await cache.middleware(req, res, next);
  // eslint-disable-next-line no-console
  expect(console.log).toHaveBeenCalledTimes(0);
});
