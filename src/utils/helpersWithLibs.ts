import moment from "moment";
import { type ImageLoaderProps } from "next/image";
import FileResizer from "react-image-file-resizer";

export const resizeFile = (
  file: File
): Promise<string | File | Blob | ProgressEvent<FileReader>> =>
  new Promise((resolve) => {
    FileResizer.imageFileResizer(file, 200, 200, "WEBP", 100, 0, (uri) => { resolve(uri); }, "base64");
  });


export const normalizeSrc = (src: string) => src.startsWith('/') ? src.slice(1) : src

export function cloudinaryLoader({ src, width, quality }: ImageLoaderProps) {
  const params = ['f_auto', 'c_limit', `w_${width}`, `q_${(quality ?? 'auto')}`];
  return `https://res.cloudinary.com/dnszg6zqs/image/upload/${params.join(',')}/${normalizeSrc(src)}`;
}

export const convertDateMoment = (date: Date, format = "DD-MM-YYYY"): string => {
  return moment(date).format(format)
}

/* export const dataURLtoFile = (data: string, filename: string) => {
  var arr = data.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[arr.length - 1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
} */

/* export const base64toBlob = (base64Data: string): { blob: Blob, ext: string } => {
  const arr = base64Data.split(',');
  const mime = arr[0]?.match(/:(.*?);/)?.[1];
  const sliceSize = 1024;
  const byteCharacters = atob(arr[arr.length - 1]);
  const bytesLength = byteCharacters.length;
  const slicesCount = Math.ceil(bytesLength / sliceSize);
  const byteArrays = new Array<Uint8Array>(slicesCount);

  for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    const begin = sliceIndex * sliceSize;
    const end = Math.min(begin + sliceSize, bytesLength);

    const bytes = new Array<number>(end - begin);
    for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters.charCodeAt(offset);
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes);
  }
  const ext = mime?.split("/")[1];
  if (!ext) {
    throw new Error("Invalid base64 data: Unable to determine file extension");
  }
  return { blob: new Blob(byteArrays, { type: mime }), ext };
}; */