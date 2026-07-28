type TDefaultPageConfigObject = Record<string, unknown>;

export type TDefaultPageConfig<
  TUi extends TDefaultPageConfigObject = TDefaultPageConfigObject,
  TConsts extends TDefaultPageConfigObject = TDefaultPageConfigObject,
> = {
  ui: TUi;
  consts: TConsts;
};
