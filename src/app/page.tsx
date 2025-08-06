'use client';
import { useState, FormEvent } from 'react';
import Head from 'next/head';

export default function Home() {
  const [longUrl, setLongUrl] = useState<string>('');
  const [shortUrl, setShortUrl] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const FLASK_BACKEND_URL = "https://url-shortener-backend-ol0l.onrender.com/shorten"
  console.log('ENV:', process.env.API);

  if (!FLASK_BACKEND_URL) {
    console.error('FLASK_BACKEND_URL is not defined!');
  }
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setShortUrl('');

    try {
      const response = await fetch(`${FLASK_BACKEND_URL}/shorten`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: longUrl }),
      });

      const data = await response.json();

      if (response.ok) {
        setShortUrl(data.new_url);
        setLongUrl('');
      } else {
        setError(data.error || 'Something went wrong!');
      }
    } catch (err) {
      setError('Failed to connect to the backend API. Please check if the Flask server is running.');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (shortUrl) {
      const textArea = document.createElement('textarea');
      textArea.value = shortUrl;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        alert('Short URL copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy:', err);
        alert('Failed to copy URL. Please copy manually.');
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <div className="min-h-screen bg-pink-200 flex items-center justify-center p-4 font-sans">
      <Head>
        <title>URL Shortener</title>
        <meta name="description" content="URL shortener using python and react."/>
      </Head>

      <main className="bg-purple-300 p-8 rounded-lg shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-pink-800 mb-6">
          🔗 URL Shortener
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="longUrl" className="block text-sm font-medium text-gray-700 mb-1">
              Enter Long URL:
            </label>
            <input
              type="url"
              id="longUrl"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="https://google.com/"
              value={longUrl}
              onChange={(e) => setLongUrl(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-slate-600 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Shortening...' : 'Shorten URL'}
          </button>
        </form>

        {error && (
          <p className="mt-4 text-red-600 text-center text-sm">{error}</p>
        )}

        {shortUrl && (
          <div className="mt-6 p-4 bg-rose-100 border border-blue-200 rounded-md flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-blue-800 text-sm break-all flex-grow">
              Your Short URL:{' '}
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline"
              >
                {shortUrl}
              </a>
            </p>
            <button
              onClick={handleCopy}
              className="flex-shrink-0 py-1.5 px-3 border border-blue-600 rounded-md text-sm font-medium text-blue-600 bg-white hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Copy
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
