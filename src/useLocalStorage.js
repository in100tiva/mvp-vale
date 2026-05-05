import { useState, useEffect, useRef } from 'react';

/**
 * useLocalStorage — persiste state em localStorage com fallback para valor inicial.
 *
 * - Lê uma vez na montagem (sincronamente, antes do primeiro paint).
 * - Escreve a cada mudança de valor.
 * - Tolera SSR / localStorage indisponível (privacidade, modo anônimo, etc.).
 *
 * Uso:
 *   const [requests, setRequests] = useLocalStorage('vale.requests', INITIAL_REQUESTS);
 *
 * Para limpar tudo do app:
 *   resetValeStorage()
 */

const PREFIX = 'vale.';

function readKey(key, fallback) {
  if (typeof window === 'undefined' || !window.localStorage) return fallback;
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch {
    // JSON inválido ou bloqueio de storage — volta para o fallback.
    return fallback;
  }
}

function writeKey(key, value) {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // Storage cheio ou modo anônimo — silencioso de propósito.
  }
}

export function useLocalStorage(key, initialValue) {
  // Inicializa lendo do storage uma vez. Lazy init evita parse a cada render.
  const [value, setValue] = useState(() => readKey(key, initialValue));

  // Mantém uma flag para não re-escrever no primeiro render se o valor veio do storage.
  const skipFirstWrite = useRef(true);

  useEffect(() => {
    if (skipFirstWrite.current) {
      skipFirstWrite.current = false;
      // Garantir que o valor inicial fique persistido se ainda não estava lá.
      // Assim, na primeira sessão, o seed mockado vira o estado base no storage.
      const raw = window.localStorage?.getItem(PREFIX + key);
      if (raw === null) writeKey(key, value);
      return;
    }
    writeKey(key, value);
  }, [key, value]);

  return [value, setValue];
}

export function resetValeStorage() {
  if (typeof window === 'undefined' || !window.localStorage) return;
  const toRemove = [];
  for (let i = 0; i < window.localStorage.length; i++) {
    const k = window.localStorage.key(i);
    if (k && k.startsWith(PREFIX)) toRemove.push(k);
  }
  toRemove.forEach(k => window.localStorage.removeItem(k));
}
