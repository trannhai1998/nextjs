import http from '@/lib/http';
import { UploadImageResType } from '@/schemaValidations/media.schema';

export const mediaApiRequest = {
	upload: (body: FormData) =>
		http.post<UploadImageResType>('media/upload', body),
	get: (url: string) => http.get(url),
	delete: (url: string) => http.delete(url),
};
