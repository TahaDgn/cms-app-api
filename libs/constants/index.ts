import { config } from 'dotenv';

config();

export const REDIS_EXPIRE_5_MIN = 5 * 60; // 5 minutes
export const REDIS_EXPIRE_15_MIN = 15 * 60; // 15 minutes

// RabbitMQ Queue Names
export const NOTIFICATION_QUEUE = 'notification.queue';

export const DATABASE_URL = process.env.DATABASE_URL;

export const IDENTITY_SERVICE_GRPC_URL = process.env.IDENTITY_SERVICE_GRPC_URL;
export const CMS_SERVICE_GRPC_URL = process.env.CMS_SERVICE_GRPC_URL;
export const ORCHESTRATOR_SERVICE_GRPC_URL =
  process.env.ORCHESTRATOR_SERVICE_GRPC_URL;

export const GATEWAY_HTTP_PORT = parseInt(process.env.GATEWAY_HTTP_PORT, 10);

export const RABBIT_MQ_URL = process.env.RABBIT_MQ_URL;

export const REDIS_URL = process.env.REDIS_URL;

export const MAIL_HOST = process.env.MAIL_HOST;
export const MAIL_PORT = parseInt(process.env.MAIL_PORT, 10);
export const MAIL_USER = process.env.MAIL_USER;
export const MAIL_PASS = process.env.MAIL_PASS;

export const ACCESS_VERIFY_API_BASE_URL =
  process.env.ACCESS_VERIFY_API_BASE_URL;
export const ACCESS_REDIRECTION_PAGE_BASE_URL =
  process.env.ACCESS_REDIRECTION_PAGE_BASE_URL;
export const ACCESS_FAILED_REDIRECTION_PAGE_URL =
  process.env.ACCESS_FAILED_REDIRECTION_PAGE_URL;
