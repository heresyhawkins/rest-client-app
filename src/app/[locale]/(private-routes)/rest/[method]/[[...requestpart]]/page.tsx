import dynamic from 'next/dynamic';

const RestClientLazy = dynamic(
  () =>
    import('../../../../../../components/RestClient/RestClient').then(
      (mod) => mod.RestClient
    ),
  {
    loading: () => (
      <p className="text-center p-4 text-violet-950">Loading REST client...</p>
    ),
  }
);

export default async function RestDynamicPage() {
  return <RestClientLazy />;
}
