import { CDN_URL } from '../../utils/constants';

export function getImageUrl(image: string): string {
    if (/^https?:\/\//.test(image)) {
        return image;
    }

    return `${CDN_URL}/${image.replace(/^\/+/, '')}`;
}

export function readFormData(form: HTMLFormElement): Record<string, string> {
    const data: Record<string, string> = {};
    new FormData(form).forEach((value, key) => {
        data[key] = String(value);
    });
    return data;
}