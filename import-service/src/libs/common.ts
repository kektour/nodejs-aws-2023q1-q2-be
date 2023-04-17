export const handlerPath = (context: string) => {
  return `${context.split(process.cwd())[1].substring(1).replace(/\\/g, '/')}`;
};

export const getEnvVar = (value: string): string => {
  const envVar = process.env[value];
  if (!envVar) {
    throw new Error(`Process env var missing: ${value}`);
  }

  return envVar;
};
