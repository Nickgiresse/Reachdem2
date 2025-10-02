// jest.setup.js
import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return '/'
  },
}))

// Mock environment variables
process.env.NEXT_PUBLIC_NOTCHPAY_PUBLIC_KEY = 'pk_test_mock_key'
process.env.NOTCHPAY_SECRET_KEY = 'sk_test_mock_key'
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test_db'
