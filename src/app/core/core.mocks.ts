import { Catalog, RuleApp } from './core.interface';

export const catalogsMock: Catalog[] = Array.from({ length: 10 }).map(
  (_, i) => ({
    name: `Catalog ${i + 1}`,
    uri: `//catalog/${i + 1}`,
  })
);

export const createRuleAppsMock = (catalogUri: string): RuleApp[] =>
  Array.from({ length: 10 }).map((_, i) => ({
    name: `Rule app ${i + 1}, Catalog ${catalogUri}`,
    revisions: Array.from({ length: 10 }).map((_, n) => ({
      revision: `Revision ${n + 1}, Rule app ${i + 1}, Catalog ${catalogUri}`,
    })),
  }));

export const createLabelsMock = (catalogUri: string): string[] =>
  Array.from({ length: 10 }).map(
    (_, i) => `Label ${i + 1}, Catalog ${catalogUri}`
  );

export const userEmailMock = 'current@user.com';
export const accessTokenMock = '0697a80d-c496-4894-a1ca-678eb16b7e96';
