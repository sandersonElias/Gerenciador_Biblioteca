/**
 * Format date to Brazilian format (DD/MM/YYYY)
 */
export const formatDate = (date: string | Date): string => {
  if (!date) return '-';
  const d = new Date(date);
  return d.toLocaleDateString('pt-BR');
};

/**
 * Format date with time
 */
export const formatDateTime = (date: string | Date): string => {
  if (!date) return '-';
  const d = new Date(date);
  return d.toLocaleString('pt-BR');
};

/**
 * Truncate text with ellipsis
 */
export const truncate = (text: string, maxLength: number): string => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Format number with thousand separators
 */
export const formatNumber = (num: number): string => {
  return num.toLocaleString('pt-BR');
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

/**
 * Generate unique ID
 */
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

/**
 * Sleep/delay function
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Deep clone object
 */
export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Remove accents from string
 */
export const removeAccents = (str: string): string => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

/**
 * Parse JWT token
 */
export const parseJwt = (token: string): any => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
};

/**
 * Check if token is expired
 */
export const isTokenExpired = (token: string): boolean => {
  const decoded = parseJwt(token);
  if (!decoded || !decoded.exp) return true;
  
  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
};

/**
 * Capitalize first letter of each word
 */
export const capitalize = (str: string): string => {
  return str.replace(/\b\w/g, l => l.toUpperCase());
};

/**
 * Format role name for display
 */
export const formatRole = (role: string): string => {
  const roleMap: Record<string, string> = {
    'ROLE_ADMIN': 'Administrador',
    'ROLE_FUNCIONARIO': 'Funcionário',
    'ROLE_ALUNO': 'Aluno',
  };
  return roleMap[role] || role;
};

/**
 * Get status color class
 */
export const getStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    'ATIVO': 'green',
    'ATIVA': 'green',
    'DISPONIVEL': 'green',
    'ATRASADO': 'red',
    'DEVOLVIDO': 'blue',
    'CONCLUIDA': 'blue',
    'CANCELADA': 'gray',
    'EXPIRADA': 'red',
  };
  return colorMap[status] || 'gray';
};
