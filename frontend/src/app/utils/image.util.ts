import { environment } from '../../environments/environment';

/**
 * Resolves a product image URL.
 * - Cloudinary / any full URL → returned as-is
 * - Legacy filename → constructed from apiBaseUrl
 */
export function resolveImageUrl(thumbnail: string | undefined | null): string {
    if (!thumbnail) return '';
    if (thumbnail.startsWith('http://') || thumbnail.startsWith('https://')) {
        return thumbnail;
    }
    return `${environment.apiBaseUrl}/products/images/${thumbnail}`;
}
