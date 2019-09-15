import { SecretsManager } from 'aws-sdk'
import middy from '@middy/core'

interface ISecretsManagerOptions {
  cache?: boolean;
  cacheExpiryInMillis?: number;
  secrets?: { [key: string]: string; };
  awsSdkOptions?: Partial<SecretsManager.Types.ClientConfiguration>;
  throwOnFailedCall?: boolean;
}

declare function secretsManager(opts?: ISecretsManagerOptions): middy.IMiddyMiddlewareObject;

export default secretsManager
