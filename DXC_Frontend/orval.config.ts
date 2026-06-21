import { defineConfig } from 'orval'

export default defineConfig({
  api: {
    input: {
      target: 'http://localhost:5293/swagger/v1/swagger.json', // Đường dẫn đến Swagger JSON từ backend
    },
    output: {
      mode: 'tags',
      clean: true,
      target: './src/api/endpoints',
      schemas: './src/api/models',
      client: 'axios',
      baseUrl: '/',
      httpClient: 'axios',
      // Sử dụng customRequest từ src/api/request.ts
      override: {
        mutator: {
          path: './src/api/request.ts',
          name: 'customRequest',
        },
      },
    },
    hooks: {
      afterAllFilesWrite: 'prettier --write',
    },
  },
})