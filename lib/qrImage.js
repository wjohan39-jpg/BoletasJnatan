// QR images are stored inline in the Firestore document (as a base64 data
// URI) instead of Firebase Storage — see docs/superpowers/specs — so the
// whole event document has to stay under Firestore's 1 MiB limit. Base64
// inflates the file by ~4/3, so a 600 KB source file becomes ~800 KB
// encoded, leaving headroom for the rest of the document's fields.
const MAX_QR_FILE_BYTES = 600 * 1024;

export function readQrImageFile(file) {
  if (file.size > MAX_QR_FILE_BYTES) {
    return Promise.reject(
      new Error('La imagen es muy pesada. Usa un archivo de menos de 600 KB (el QR que te comparte el proveedor normalmente ya es así de liviano).')
    );
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('No se pudo leer la imagen.'));
    reader.readAsDataURL(file);
  });
}
