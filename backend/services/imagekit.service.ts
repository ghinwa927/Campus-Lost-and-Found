import ImageKit from "imagekit";

export function createImageKit(config: {
  publicKey: string;
  privateKey: string;
  urlEndpoint: string;
}) {
  return new ImageKit({
    publicKey: config.publicKey,
    privateKey: config.privateKey,
    urlEndpoint: config.urlEndpoint,
  });
}