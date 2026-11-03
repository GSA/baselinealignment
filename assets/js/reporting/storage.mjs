// One workspace per deployment path. Transactions must commit before "saved".
export async function openWorkspaceStore(namespace, indexedDB = globalThis.indexedDB) {
  if (!indexedDB) throw new Error('Browser storage is unavailable.');
  const db = await new Promise((resolve, reject) => {
    const request = indexedDB.open(`baseline-reporting:${namespace}`, 1);
    request.onupgradeneeded = () => request.result.createObjectStore('workspace');
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    request.onblocked = () => reject(new Error('Browser storage is blocked by another tab.'));
  });
  function transact(mode, operation) {
    return new Promise((resolve, reject) => {
      const tx = db.transaction('workspace', mode);
      const request = operation(tx.objectStore('workspace'));
      tx.oncomplete = () => resolve(request.result);
      tx.onerror = tx.onabort = () => reject(tx.error || request.error || new Error('Storage transaction failed.'));
    });
  }
  return {read: () => transact('readonly', s => s.get('current')),
    write: value => transact('readwrite', s => s.put(value, 'current')),
    remove: () => transact('readwrite', s => s.delete('current')),
    close: () => db.close()};
}
