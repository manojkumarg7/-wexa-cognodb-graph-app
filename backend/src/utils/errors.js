function isDatabaseUnavailableError(error) {
  if (!error) {
    return false;
  }

  const code = error.code || '';
  const message = (error.message || '').toLowerCase();

  return (
    code.startsWith('ServiceUnavailable') ||
    code.startsWith('SessionExpired') ||
    code.startsWith('Neo.ClientError.Security') ||
    message.includes('failed to connect') ||
    message.includes('connection') ||
    message.includes('econnrefused') ||
    message.includes('enotfound') ||
    message.includes('timed out') ||
    message.includes('authentication')
  );
}

function handleRouteError(res, error, fallbackMessage) {
  console.error(fallbackMessage, error.message);

  if (isDatabaseUnavailableError(error)) {
    return res.status(503).json({
      status: 'error',
      message: 'CognoDB is currently unavailable',
      error: error.message,
    });
  }

  return res.status(500).json({
    status: 'error',
    message: fallbackMessage,
    error: error.message,
  });
}

module.exports = {
  isDatabaseUnavailableError,
  handleRouteError,
};
