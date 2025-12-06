/**
 * Remove propriedades com valores vazios, null ou undefined de um objeto
 * @param obj - Objeto a ser filtrado
 * @returns Novo objeto apenas com valores válidos
 */
export function filterEmptyValues<T extends Record<string, any>>(obj: T): Partial<T> {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (value !== '' && value !== null && value !== undefined) {
      acc[key as keyof T] = value;
    }
    return acc;
  }, {} as Partial<T>);
}

/**
 * Mescla dois objetos, preservando valores existentes quando os novos valores são vazios
 * @param existing - Objeto com dados existentes
 * @param updates - Objeto com atualizações
 * @returns Novo objeto mesclado
 */
export function mergePreservingValues<T extends Record<string, any>>(
  existing: T,
  updates: Partial<T>
): T {
  const filteredUpdates = filterEmptyValues(updates);
  return {
    ...existing,
    ...filteredUpdates,
  };
}
