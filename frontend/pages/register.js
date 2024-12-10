import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Register() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Crea il tuo account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Oppure{' '}
          <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
            accedi se hai già un account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div>
            <button
              onClick={() => window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`}
              className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <img
                className="h-6 w-6 mr-2"
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google logo"
              />
              Continua con Google
            </button>
          </div>

          <div className="mt-6 text-center text-sm text-gray-500">
            Registrandoti, accetti i nostri{' '}
            <Link href="/terms" className="font-medium text-blue-600 hover:text-blue-500">
              Termini di Servizio
            </Link>
            {' '}e la nostra{' '}
            <Link href="/privacy" className="font-medium text-blue-600 hover:text-blue-500">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
