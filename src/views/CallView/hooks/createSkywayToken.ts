import { nowInSec, SkyWayAuthToken, uuidV4 } from '@skyway-sdk/room';
import { useState } from 'react';
const appId: string | undefined = process.env.NEXT_PUBLIC_APP_SKYWAY_APP_ID ?? ``
const secretKey: string | undefined =process.env.NEXT_PUBLIC_APP_SKYWAY_SECRET_KEY ?? ``

export const useSkywayToken = () => {
  // console.log(appId);
  // console.log(secretKey);
  const token = new SkyWayAuthToken({
    jti: uuidV4(),
    iat: nowInSec(),
    exp: nowInSec() + 60 * 60 * 24,
    scope: {
      app: {
        id: appId,
        turn: true,
        actions: ['read'],
        channels: [
          {
            id: '*',
            name: '*',
            actions: ['write'],
            members: [
              {
                id: '*',
                name: '*',
                actions: ['write'],
                publication: {
                  actions: ['write'],
                },
                subscription: {
                  actions: ['write'],
                },
              },
            ],

            sfuBots: [
              {
                actions: ['write'],
                forwardings: [
                  {
                    actions: ['write'],
                  },
                ],
              },
            ],
          },
        ],
      },
    },
  }).encode(secretKey);
  const [skywayToken] = useState<string>(token);

  return { skywayToken };
};
