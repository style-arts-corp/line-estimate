export default {
  lineEstimateApi: {
    input: {
      target: './openapi.yaml',
    },
    output: {
      mode: 'tags-split',
      workspace: './src/orval',
      target: 'generated/lineEstimateApi.ts',
      schemas: 'generated/model',
      indexFiles: false,
      client: 'react-query',
      title: (title: string) => `${title}Api`,
      override: {
        mutator: {
          path: 'customClient.ts',
          name: 'useCustomClient',
        },
      },
      // mock: {
      //   type: 'msw',
      //   delay: 1000,
      //   useExamples: true,
      // },
    },
    hooks: {
      afterAllFilesWrite: 'prettier --write',
    },
  },
};

