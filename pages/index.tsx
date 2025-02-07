import Head from 'next/head';
import dynamic from 'next/dynamic';

const MultiplePreview = dynamic(() => import('../components/MultiplePreview').then(mod => mod.MultiplePreview), { 
  ssr: false 
});

export default function Home() {
  return (
    <div>
      <Head>
        <title>Multiple Video Previews</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MultiplePreview />
    </div>
  );
}
