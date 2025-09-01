import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

interface FormData {
  name: string;
}

function App() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [response, setResponse] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {

      const result = await axios.post(process.env.NODE_ENV === "development" ? 'http://localhost:8080/api/hello' : 'https://d2wdksfxj1l691.cloudfront.net/api/hello', {
        name: data.name
      });
      
      if (typeof result.data === 'string') {
        setResponse(result.data);
      } else if (result.data && result.data.message) {
        setResponse(result.data.message);
      } else {
        setResponse(JSON.stringify(result.data));
      }
    } catch (error) {
      setResponse('Error connecting to backend');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Hello World App
        </h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Enter your name
            </label>
            <input
              {...register('name', { required: 'Name is required' })}
              type="text"
              id="name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
              placeholder="Your name here..."
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 ease-in-out transform hover:scale-105 disabled:scale-100"
          >
            {loading ? 'Sending...' : 'Say Hello'}
          </button>
        </form>

        {response && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="font-medium text-green-800 mb-2">Response:</h3>
            <p className="text-green-700">{response}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;