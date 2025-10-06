import React, { useState } from 'react'

const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT || ''

function Field({ label, children }) {
  return (
    <label className="block text-sm font-medium text-gray-700">
      <div className="mb-1">{label}</div>
      {children}
    </label>
  )
}

export default function App() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [complaint, setComplaint] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    try {
      const payload = { name, email, complaint }

      const res = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || `${res.status} ${res.statusText}`)
      }

      setStatus('success')
      setName('')
      setEmail('')
      setComplaint('')
    } catch (err) {
      console.error(err)
      setErrorMsg(err.message || 'Network error')
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-md p-8">
        <h1 className="text-center text-2xl font-semibold text-gray-800 mb-1">Customer Complaint Portal</h1>
        <p className="text-center text-sm text-gray-500 mb-6">We value your feedback — please tell us about your experience.</p>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <Field label="Name">
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                type="text"
                placeholder="Full name"
              />
            </Field>
          </div>

          <div>
            <Field label="Email">
              <input
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                type="email"
                placeholder="you@example.com"
              />
            </Field>
          </div>

          <div>
            <Field label="Complaint">
              <textarea
                required
                value={complaint}
                onChange={(e) => setComplaint(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                rows={5}
                placeholder="Describe your issue..."
              />
            </Field>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={status === 'loading'}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700 disabled:opacity-60"
            >
              {status === 'loading' ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                  </svg>
                  Sending...
                </>
              ) : (
                'Submit Complaint'
              )}
            </button>

          </div>
        </form>

        <div className="mt-6">
          {status === 'success' && (
            <div className="rounded-md bg-green-50 p-3 text-green-800 text-sm">Thanks — your complaint has been submitted. We'll follow up if needed.</div>
          )}

          {status === 'error' && (
            <div className="rounded-md bg-red-50 p-3 text-red-800 text-sm">There was a problem sending your complaint: {errorMsg}</div>
          )}
        </div>

        <div className="mt-4 text-xs text-gray-400 text-center">Powered by your API Gateway endpoint</div>
      </div>
    </div>
  )
}
