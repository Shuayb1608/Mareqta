import { LockClosedIcon } from '@heroicons/react/solid';
import useUser from '../lib/useUser';
import fetchJson from '../lib/fetchJson';
import { useRouter } from 'next/router';


export default function SignUp() {
  const { mutateUser } = useUser({
    redirectTo: '/',
    redirectIfFound: true,
  });

  async function handleSubmit(e) {
    e.preventDefault();

    const body = {
      email: e.currentTarget.email.value,
      password: e.currentTarget.password.value,
      lastName: e.currentTarget.lastName.value,
      firstName: e.currentTarget.firstName.value,
      birthDate: e.currentTarget.birthDate.value,
      address1: e.currentTarget.address1.value,
      city: e.currentTarget.city.value,
      county: e.currentTarget.county.value,
      postalCode: e.currentTarget.postalCode.value,
      phone: e.currentTarget.phone.value,
    };

    try {
      const response = await fetchJson('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (response.redirectToKycCheck) {
        // Redirect to the KYC check page
        console.log(`resonse for user's email before going to kyc`, response.user);
        window.location.href = `/kyc-check?email=${response.user}`
      } else {
        await mutateUser(response);
      }
    } catch (error) {
      console.error('An unexpected error happened:', error);
    }
  }

  const router = useRouter();
    
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <img
            className="mx-auto h-24 w-auto"
            src="/images/Logo.png"
            alt="Workflow"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create an account
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6" method="POST">
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            {/* First name */}
            <div>
              <label htmlFor="firstName" className="sr-only">
                First name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="First name"
              />
            </div>
            {/* Last name */}
            <div>
              <label htmlFor="lastName" className="sr-only">
                Last name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Last name"
              />
            </div>
            {/* Email address */}
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            {/* Password */}
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
            {/* Birth date */}
            <div>
              <label htmlFor="birthDate" className="sr-only">
                Birth date
              </label>
              <input
                id="birthDate"
                name="birthDate"
                type="date"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus                :outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Birth date"
              />
            </div>
            {/* Address */}
            <div>
              <label htmlFor="address1" className="sr-only">
                Address
              </label>
              <input
                id="address1"
                name="address1"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Address"
              />
            </div>
            {/* City */}
            <div>
              <label htmlFor="city" className="sr-only">
                City
              </label>
              <input
                id="city"
                name="city"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="City"
              />
            </div>
            {/* County */}
            <div>
              <label htmlFor="county" className="sr-only">
                County
              </label>
              <input
                id="county"
                name="county"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="County"
              />
            </div>
            {/* Postal code */}
            <div>
              <label htmlFor="postalCode" className="sr-only">
                Postal code
              </label>
              <input
                id="postalCode"
                name="postalCode"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Postal code"
              />
            </div>
            {/* Phone */}
            <div>
              <label htmlFor="phone" className="sr-only">
                Phone
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Phone"
              />
            </div>
         {/* Submit button */}
         <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <LockClosedIcon className="h-5 w-5 text-green-500 group-hover:text-green-400" aria-hidden="true" />
                </span>
                Sign Up
              </button>
            </div>

            {/* Sign In button */}
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600 mt-2">Or</p>
              <button
                onClick={() => router.push('/signin')}
                className="mt-2 font-medium text-green-600 hover:text-green-500"
              >
                Sign In
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}






