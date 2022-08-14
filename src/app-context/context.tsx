import React from 'react';
import { Props } from './interface'

const ComposeProviders: React.FunctionComponent<Props> = function (props: Props) {
  const { providers, children } = props;
  return (
    <>
      {providers.reduceRight((accumulator: React.ReactNode, Provider: any) => {
        console.log(typeof Provider) // is a function
        // Provider: (props: Props) => React.ReactNode
        // accumulator is nested tree of components so falls under React.ReactNode
        return <Provider>{accumulator}</Provider>
      }, children)}
    </>
  );
}

export default ComposeProviders;