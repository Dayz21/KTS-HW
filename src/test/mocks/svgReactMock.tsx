import * as React from 'react';

const SvgReactMock = (props: React.SVGProps<SVGSVGElement>) => (
  <svg data-testid="svg-icon" {...props} />
);

export default SvgReactMock;
