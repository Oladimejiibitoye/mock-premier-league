import { Response } from 'express';

/**
 * Send an error JSON
 * @param res - response object
 * @param code - status code
 * @param message - error message
 * @returns {Object} - JSON response
 */
export const errorResMsg = (res: Response, code: number, message: string): Response => {
  return res.status(code).json({
    status: 'error',
    error: message,
  });
};

/**
 * Success JSON to be sent
 * @param res - response Object
 * @param code - status code
 * @param responseData - data to be sent, it requires a message object
 * @returns {Object} - JSON response
 */
export const successResMsg = (res: Response, code: number, responseData: { message: string; data?: any }): Response => {
  const { message, data } = responseData;
  return res.status(code).json({
    status: 'success',
    message,
    data,
  });
};

/**
 * Custom JSON response to be sent
 * @param res - response Object
 * @param code - status code
 * @param status - status string (e.g. 'success', 'error')
 * @param responseData - data to be sent, it requires a message object
 * @returns {Object} - JSON response
 */
export const customResMsg = (
  res: Response,
  code: number,
  status: string,
  responseData: { message: string; data?: any }
): Response => {
  const { message, data } = responseData;
  return res.status(code).json({
    status,
    message,
    data,
  });
};

/**
 * Redirect response
 * @param res - response object
 * @param url - URL to redirect to
 * @returns {void} - redirects to a given URL
 */
export const redirect = (res: Response, url: string): void => {
  res.status(302).redirect(url);
};
