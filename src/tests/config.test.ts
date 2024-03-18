import { config, Config } from '../config.js';

describe('read config', () => {
  const expectedConfig: Config = {
    JSON_RPC_PROVIDER_BSC: 'https://bsc-dataseed.bnbchain.org',
    PRIVATE_WALLET_KEY: 'hello world you want my secret key?',
  }
  it('should have a configuration', () => {
    expect(config).toEqual(expectedConfig);
  });
});
