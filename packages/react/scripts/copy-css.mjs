import { cpSync, existsSync } from 'node:fs'
import { extname } from 'node:path'

// O `tsc` so emite .ts/.tsx compilados; arquivos .css proprios do pacote
// (ex.: dashboard/dashboard.css) precisam ser copiados manualmente para
// o dist publicado, senao os imports relativos quebram para quem instala
// o pacote.
if (existsSync('src')) {
    cpSync('src', 'dist', {
        recursive: true,
        filter: (source) => extname(source) === '' || source.endsWith('.css'),
    })
}
