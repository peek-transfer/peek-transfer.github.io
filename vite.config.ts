import { defineConfig, Plugin, loadEnv } from 'vite'
import legacy from '@vitejs/plugin-legacy'
import { readFile } from "fs/promises";
import { dirname, resolve } from 'path';
import vue from '@vitejs/plugin-vue'
import UnoCSS from "unocss/vite";
import { presetIcons, transformerDirectives, presetWind } from "unocss";
import mkcert from "vite-plugin-mkcert";
import { VitePWA } from "vite-plugin-pwa";
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import { fileURLToPath } from 'url';

const readJsonFile = async (path: string) =>
  JSON.parse(
    await readFile(
      resolve(__dirname, `./node_modules/${path}`), { encoding: 'utf-8' }
    )
  )

const htmlPlugin = (mode: string): Plugin => {
  console.log(mode)
  const env = loadEnv(mode, process.cwd())
  const gtmId = env['VITE_GTM_ID']
  console.log('ASSAY ID:', gtmId)
  return {
    name: 'custom-html-plugin',
    enforce: 'post',
    transformIndexHtml: (html) => {
      const newHtml = html.replace(`<!-- ASSAY -->`, gtmId ? `<!-- Google tag (gtag.js) -->
      <script async src="https://www.googletagmanager.com/gtag/js?id=${gtmId}"></script>
      <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${gtmId}');
      </script>`: '')
      return newHtml
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    https: true
  },
  plugins: [
    vue(),
    UnoCSS({
      presets: [
        presetWind(),
        presetIcons({
          collections: {
            material: () => readJsonFile('@iconify-json/mdi/icons.json').then(i => i.default),
          }
        }),
      ],
      transformers: [transformerDirectives()]
    }),
    htmlPlugin(mode),
    mkcert(),
    VueI18nPlugin({
      /* options */
      // locale messages resourece pre-compile option
      include: resolve(dirname(fileURLToPath(import.meta.url)), './src/locale/lang/**'),
    }),
    VitePWA({
      includeAssets: ["favicon.ico", "robots.txt", "apple-touch-icon.png"],
      manifest: {
        name: "Peek - transfer",
        short_name: "Peek",
        description: "Chat & Transfer P2P",
        theme_color: "#000000",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
    legacy({
      targets: ['defaults', 'not IE 11'],
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      'lib': resolve(__dirname, './src/lib'),
    },
  },
  esbuild: {
    drop: mode === 'production' ? ['console', 'debugger'] : undefined
  },
  build: {
    minify: 'esbuild'
  }
}))
