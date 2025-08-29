export const getPayloadUrl = (): string => {
  return process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3003/api';
};
