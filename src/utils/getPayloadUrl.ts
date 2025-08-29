export const getPayloadUrl = (): string => {
  if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_PAYLOAD_URL) {
    return process.env.NEXT_PUBLIC_PAYLOAD_URL;
  }
  return 'http://localhost:3000/api';
};
