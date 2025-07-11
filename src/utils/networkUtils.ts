export const checkNetworkConnection = async (): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 seconds timeout

    const response = await fetch('https://www.google.com', {
      method: 'HEAD',
      cache: 'no-cache',
      signal: controller.signal,
    });
    // Clear the timeout if the request completes successfully
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    return false;
  }
}