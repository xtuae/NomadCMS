export const getPayloadUrl = (): string => {
  return process.env.NEXT_PUBLIC_PAYLOAD_URL || 'https://nomadcms.vercel.app/api';
};
