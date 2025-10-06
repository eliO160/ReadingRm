//reader page
'use client';
import { useParams } from 'next/navigation';

export default function BookReaderPage() {
  const params = useParams();
  const id = params?.id;

  return (
    <main>
      <h1>Reader (Book ID: {id})</h1>

      {/* The actual book content would be rendered here */}
      <iframe
        title="Book HTML"
        src={`/api/books/html/${id}`}
        style={{ width: '100%', height: '80vh', border: 'none' }}
      />
    </main>
  );
}
