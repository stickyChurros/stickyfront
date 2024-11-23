/**
 * Vite Configuration for Production Optimization
 *
 * Key features:
 * - Image optimization:
 *   • Converts images to WebP format (80% quality)
 *   • Limits max height to 1080px
 *   • Removes metadata for smaller file size
 * - Asset compression:
 *   • Compresses JS, CSS, HTML, and SVG files above 1.4KB
 *   • Uses Gzip compression for smaller file sizes
 * - SVG handling:
 *   • Removes hardcoded dimensions for responsive scaling
 *   • Enables CSS-based dimension control
 * - Bundle optimization:
 *   • Implements smart vendor chunk splitting
 * - Path aliasing:
 *   • Maps '@' to '/src' for cleaner imports
 *
 * @see https://vitejs.dev/config/
 */

import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react-swc'
import {vanillaExtractPlugin} from "@vanilla-extract/vite-plugin";
import svgr from "vite-plugin-svgr";
import {imagetools} from "vite-imagetools";
import compression from "vite-plugin-compression2";

export default defineConfig({
    plugins: [react(),
        vanillaExtractPlugin(),
        compression({
            include: /\.(js|css|html|svg)$/,  // Specify file extensions for compression
            threshold: 1400,                   // Only compress files larger than 1.4KB
        }),
        svgr({
            svgrOptions: {
                dimensions: false,  // Remove width/height attributes from SVGs to rely on CSS styling
            },
        }),
        imagetools({
            exclude: "**/*.webp",
            defaultDirectives: () =>
                new URLSearchParams({
                    format: "webp",
                    quality: "80",  // Apply lossy compression with 80% quality for optimal size/quality ratio
                    removeMetadata: "",
                    h: "1080",
                }),
        }),
    ],

    build: {
        rollupOptions: {
            output: {
                /**
                 * Manual chunk splitting configuration
                 * Groups related packages into their own chunks for better caching
                 * use vendorKeywords to match specific packages
                 */
                manualChunks: (id: string) => {
                    if (id.includes('node_modules')) {

                        // Define vendorKeywords to match specific packages================>
                        const vendorKeywords = ['react', 'micromark', 'unist', 'remark', 'mdast'];
                        //=================================================================>

                        const vendorRegex = new RegExp(vendorKeywords.join('|'));
                        const match = id.match(vendorRegex);
                        if (match) {
                            return `${match[0]}-vendor`;
                        }
                        const module: string = id.split('node_modules/').pop()!.split('/')[0];
                        return `vendor-${module}`;
                    }
                },
            },
        },
    },
    resolve: {
        alias: [{find: "@", replacement: "/src"}],
    },
})