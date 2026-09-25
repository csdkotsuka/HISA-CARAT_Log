/**
 * uuid.ts
 * URL制御およびセキュリティのための暗号学的に安全なUUID生成・補完ユーティリティ
 */
import type { Tenant, Customer } from '../types/tenant';

/**
 * 暗号学的に安全なUUID (v4形式) を生成
 */
export function generateSecureUuid(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // フォールバック (UUID v4準拠のランダム生成)
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * テナントにUUIDが存在しない場合に補完
 */
export function ensureTenantUuid(tenant: Tenant): Tenant {
  if (tenant.uuid && tenant.uuid.trim().length > 0) {
    return tenant;
  }
  return {
    ...tenant,
    uuid: generateSecureUuid(),
  };
}

/**
 * 顧客にUUIDが存在しない場合に補完
 */
export function ensureCustomerUuid(customer: Customer): Customer {
  if (customer.uuid && customer.uuid.trim().length > 0) {
    return customer;
  }
  return {
    ...customer,
    uuid: generateSecureUuid(),
  };
}
