import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        // Este pacote ainda nao tem testes automatizados; sem isso o vitest
        // sai com codigo de erro quando nao encontra nenhum arquivo de teste.
        passWithNoTests: true,
    },
})
