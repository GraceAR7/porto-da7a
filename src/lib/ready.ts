// Penanda sederhana: true setelah loading screen selesai.
// Dipakai agar animasi scroll/hero baru mulai setelah loader hilang.
let ready = false;
const subs = new Set<() => void>();

export const setReady = () => {
  ready = true;
  subs.forEach((f) => f());
};
export const subscribeReady = (f: () => void) => {
  subs.add(f);
  return () => {
    subs.delete(f);
  };
};
export const getReady = () => ready;
