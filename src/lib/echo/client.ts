import { configureEcho, echoIsConfigured } from "@laravel/echo-react";

import { axiosClient } from "@/lib/axios/client";

let hasWarnedAboutConfiguration = false;

export function configureEchoClient(): boolean {
  if (echoIsConfigured()) return true;

  const key = process.env.NEXT_PUBLIC_REVERB_APP_KEY;
  const host = process.env.NEXT_PUBLIC_REVERB_HOST;
  const port = Number(process.env.NEXT_PUBLIC_REVERB_PORT);
  const authorizationEndpoint = process.env.NEXT_PUBLIC_WS_AUTH_ENDPOINT;

  if (!key || !host || !Number.isFinite(port) || !authorizationEndpoint) {
    if (!hasWarnedAboutConfiguration) {
      console.warn("The public Reverb environment variables are incomplete.");
      hasWarnedAboutConfiguration = true;
    }

    return false;
  }

  configureEcho({
    broadcaster: "reverb",
    key,
    wsHost: host,
    wsPort: port,
    wssPort: port,
    forceTLS: process.env.NEXT_PUBLIC_REVERB_SCHEME === "https",
    enabledTransports: ["ws", "wss"],
    channelAuthorization: {
      customHandler: ({ socketId, channelName }, callback) => {
        axiosClient
          .post(
            authorizationEndpoint,
            { socket_id: socketId, channel_name: channelName },
          )
          .then((res) => callback(null, res.data))
          .catch((error) => callback(error, null));
      },
    },
  });

  return true;
}
