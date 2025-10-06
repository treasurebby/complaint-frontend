import React, { useState } from 'react'

const apiEndpoint = import.meta.env.VITE_API_ENDPOINT || ''

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
  const [errors, setErrors] = useState({})

  const validate = () => {
    const next = {}
    if (!name.trim()) next.name = 'Name is required'
    if (!email.trim()) next.email = 'Email is required'
    else if (!/^\S+@\S+\.\S+$/.test(email)) next.email = 'Enter a valid email address'
    if (!complaint.trim()) next.complaint = 'Please enter your complaint'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return

    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch(import.meta.env.VITE_API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name, email: email, message: complaint }),
      });

      if (res.ok) {
        setStatus('success')
        setName('')
        setEmail('')
        setComplaint('')
        // keep success UI instead of alert; also call alert for immediate feedback
        // alert('Complaint sent successfully ✅');
      } else {
        setStatus('error')
        setErrorMsg(`${res.status} ${res.statusText}`)
      }
    } catch (err) {
      console.error(err)
      setStatus('error')
      setErrorMsg(err.message || 'Network error')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-md p-8">
        <h1 className="text-center text-2xl font-semibold text-gray-800 mb-1">Customer Complaint Portal</h1>
        <p className="text-center text-sm text-gray-500 mb-6">We value your feedback — please tell us about your experience.</p>

        <form onSubmit={handleSubmit} className="space-y-4 relative">
          {status === 'loading' && (
            <div className="overlay">
              <div className="flex items-center gap-3 bg-white p-4 rounded-lg shadow">
                <svg className="animate-spin h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                </svg>
                <div className="text-sm text-gray-700">Sending complaint...</div>
              </div>
            </div>
          )}
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
              {errors.name && <div className="text-xs text-red-600 mt-1">{errors.name}</div>}
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
              {errors.email && <div className="text-xs text-red-600 mt-1">{errors.email}</div>}
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
              {errors.complaint && <div className="text-xs text-red-600 mt-1">{errors.complaint}</div>}
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
            <div className="thankyou">
              <div className="check">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 6L9 17l-5-5" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="text-sm font-medium text-green-700">Thanks — your complaint has been submitted.</div>
              <div className="text-xs text-gray-500">We'll follow up if needed.</div>
            </div>
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
