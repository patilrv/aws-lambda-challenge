// Logger Functions
export const logInfo = (message: string | any, title: string | undefined = undefined): void => {
    if (typeof message === 'string') {
      title ? console.info(`${title}: ${message}`) : console.info(message);
    } else {
      title ? console.info(`${title}:`, JSON.stringify(message, null, 2)) : console.info(JSON.stringify(message, null, 2));
    }
  };
  export const logError = (message: string | any, title: string | undefined = undefined): void => {
    if (typeof message === 'string') {
      title ? console.error(`${title}: ${message}`) : console.error(message);
    } else {
      title ? console.error(`${title}:`, JSON.stringify(message, null, 2)) : console.error(JSON.stringify(message, null, 2));
    }
  };