import app from './app';
import { PORT } from './environment/config';
import logger from './utils/logger';

const _PORT = PORT || 4000;
app.listen(_PORT, () => {
  logger.info(`Server is running on port ${_PORT}`);
});
