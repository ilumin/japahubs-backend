import { NatsConnection } from "nats";
import { NatsWrapper } from "./nats-wrapper";

// Define the authenticator function
const customAuthenticator = (nonce?: string) => {
  // Return an instance of Auth
  return {
    user: "japaUser",
    pass: "myJapaSecret",
  };
};

export const startNats = async (
  moduleName: string
): Promise<NatsConnection> => {
  const natsWrapper = new NatsWrapper(moduleName);
  try {
    await natsWrapper.connect(customAuthenticator, process.env.NATS_CONNECTION);
    if (natsWrapper.client.isClosed()) {
      console.log("NATS connection closed!");
      process.exit();
    }
    process.on("SIGINT", async () => await natsWrapper.client.drain());
    process.on("SIGTERM", async () => await natsWrapper.client.drain());

    return natsWrapper.client;
  } catch (err) {
    console.error(err);
  }
};
