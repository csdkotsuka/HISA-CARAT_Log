/**
 * consumerRegistration.ts
 * 一般コンシューマーユーザーの自己登録（セルフオンボーディング）処理
 * Masterが用意した公開テンプレートを選択し、編集権限を持たない一般個人ダイアリーとしてアカウントを作成します。
 */
import type { PublicTemplate, Tenant, Customer } from '../types/tenant';
import type { AuthUser } from '../types/auth';
import {
  getTenants,
  saveTenants,
  getCustomers,
  saveCustomers,
  saveActiveTenantId,
  saveActiveCustomerId,
  saveAppMode,
} from './tenantStorage';
import { setCurrentUser } from './authStorage';
import { saveUserPassword } from '../firebase/credentialService';
import { saveTenantToFirestore, saveCustomerToFirestore } from '../firebase/firestoreService';
import { generateSecureUuid } from './uuid';

export interface ConsumerRegistrationParams {
  name: string;
  email: string;
  password?: string;
  template: PublicTemplate;
}

export interface ConsumerRegistrationResult {
  user: AuthUser;
  tenant: Tenant;
  customer: Customer;
}

export async function registerConsumerAccount(
  params: ConsumerRegistrationParams
): Promise<ConsumerRegistrationResult> {
  const { name, email, password, template } = params;
  const normalizedEmail = email.trim().toLowerCase();
  const trimmedName = name.trim() || 'メンバー';
  const timestamp = Date.now();
  const today = new Date().toISOString().slice(0, 10);

  const tenantId = `tenant-consumer-${timestamp}`;
  const customerId = `cust-${timestamp}`;
  const userId = `user-${timestamp}`;
  const tenantUuid = generateSecureUuid();
  const customerUuid = generateSecureUuid();

  // 1. パスワード登録（入力されている場合）
  if (password && password.trim()) {
    try {
      await saveUserPassword(normalizedEmail, password.trim(), 'customer', tenantId, customerId);
    } catch (err) {
      console.warn('Password save notice:', err);
    }
  }

  // 2. テンプレート設定をベースにした個人専用テナント（閲覧・セルフログ専用）
  const newTenant: Tenant = {
    id: tenantId,
    uuid: tenantUuid,
    adminId: 'admin-master',
    name: `${trimmedName}さんのプライベートスペース`,
    email: normalizedEmail,
    industry: template.category,
    headerTitle: template.headerTitle,
    headerSubtitle: template.headerSubtitle,
    badgeText: template.badgeText,
    theme: template.theme,
    aiPersona: template.aiPersona,
    dailyConfig: template.dailyConfig,
    evalConfig: template.evalConfig,
    loungeLinks: template.loungeLinks || [],
    customerIds: [customerId],
    isConsumerPersonal: true,
    templateId: template.id,
    status: 'active',
    createdAt: today,
    updatedAt: today,
  };

  // 3. 顧客レコード
  const newCustomer: Customer = {
    id: customerId,
    uuid: customerUuid,
    tenantId: tenantId,
    name: trimmedName,
    nickname: trimmedName,
    email: normalizedEmail,
    joinedDate: today,
    isConsumer: true,
    templateId: template.id,
    status: 'active',
  };

  // 4. 認証ユーザー（ロールは常に customer / 業者管理画面へは入れない）
  const newAuthUser: AuthUser = {
    id: userId,
    email: normalizedEmail,
    name: trimmedName,
    role: 'customer',
    tenantId: tenantId,
    customerId: customerId,
    description: `${template.name} (個人メンバー)`,
  };

  // 5. ローカルストレージへの永続化
  const currentTenants = getTenants();
  saveTenants([newTenant, ...currentTenants]);

  const currentCustomers = getCustomers();
  saveCustomers([newCustomer, ...currentCustomers]);

  saveActiveTenantId(tenantId);
  saveActiveCustomerId(customerId);
  saveAppMode('customer');
  setCurrentUser(newAuthUser);

  // 6. Firestore への非同期保存
  try {
    await Promise.all([
      saveTenantToFirestore(newTenant),
      saveCustomerToFirestore(newCustomer),
    ]);
  } catch (err) {
    console.warn('Firestore consumer registration save notice:', err);
  }

  return {
    user: newAuthUser,
    tenant: newTenant,
    customer: newCustomer,
  };
}
