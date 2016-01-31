import test from 'ava';
import R, { apiBaseURL } from './src/main';
import { buildEndpoint, APICall } from './src/helpers';

const apiKey = process.env.RT_API_KEY || '';
const config = { apiKey };

test('class instanciation fails without config', t => t.throws(() => new R()));
test('class instanciation fails without apiKey', t => t.throws(() => new R({})));
test('class instanciation passes with apiKey', t => t.doesNotThrow(() => new R(config)));
test('rt object should have a config object and a buildURL method', t => {
  const rt = new R(config);

  t.ok(rt.config);
  t.same(rt.config, config);

  t.ok(rt.buildURL);
});

test('buildEndpoint helper', t => {

  t.is(typeof buildEndpoint, 'function', 'buildEndpoint helper is a function');
  t.is(typeof buildEndpoint(), 'function', 'buildEndpoint returns a closure');

  const { buildURL } = new R(config);
  const path = 'test/api/endpoint';
  const emptyParams = {};
  const filledParams = {
    limit: 15,
    country: 'us'
  };
  const searchParams = {
    ...filledParams,
    q: 'a complexe search'
  };

  t.is(buildURL(path, null), `${apiBaseURL}/${path}?apikey=${apiKey}`, 'params argument has a default value');
  t.is(buildURL(path, undefined), `${apiBaseURL}/${path}?apikey=${apiKey}`);
  t.is(buildURL(path, emptyParams), `${apiBaseURL}/${path}?apikey=${apiKey}`);
  t.is(buildURL(path, filledParams), `${apiBaseURL}/${path}?limit=15&country=us&apikey=${apiKey}`);
  t.is(buildURL(path, searchParams), `${apiBaseURL}/${path}?limit=15&country=us&q=${encodeURIComponent(searchParams.q)}&apikey=${apiKey}`);
});