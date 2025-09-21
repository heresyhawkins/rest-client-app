import dynamic from 'next/dynamic';

const VariablesLazy = dynamic(
  () =>
    import('../../../../components/Variables/Variables').then(
      (m) => m.Variables
    ),
  { loading: () => <p>Loading...</p> }
);

export default function VariablesPage() {
  return <VariablesLazy />;
}
