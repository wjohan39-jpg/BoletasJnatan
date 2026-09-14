import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase';

export async function uploadQrImage(file) {
  const path = `qr-codes/${Date.now()}-${file.name}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  const qrImageUrl = await getDownloadURL(storageRef);
  return { qrImageUrl, qrImagePath: path };
}

export async function deleteQrImage(path) {
  if (!path) return;
  const storageRef = ref(storage, path);
  await deleteObject(storageRef).catch(() => {});
}
