import moment from "moment";
import { type ImageLoaderProps } from "next/image";
import FileResizer from "react-image-file-resizer";

export const resizeFile = (
  file: File
): Promise<string | File | Blob | ProgressEvent<FileReader>> =>
  new Promise((resolve) => {
    FileResizer.imageFileResizer(file, 500, 500, "WEBP", 100, 0, (uri) => { resolve(uri); }, "base64");
  });


export const normalizeSrc = (src: string) => src.startsWith('/') ? src.slice(1) : src

export function cloudinaryLoader({ src, width, quality }: ImageLoaderProps) {
  const params = ['f_auto', 'c_limit', `w_${width}`, `q_${(quality ?? 'auto')}`];
  return `https://res.cloudinary.com/dnszg6zqs/image/upload/${params.join(',')}/${normalizeSrc(src)}`;
}

export const convertDateMoment = (date: Date, format = "DD-MM-YYYY"): string => {
  return moment(date).format(format)
}