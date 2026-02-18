import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import App from './App.jsx'

function mockFetchOk(users) {
    return vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(users),
    })
}

describe('App', () => {
    beforeEach(() => {
        vi.restoreAllMocks()
    })

    it('shows loading then renders robots from API', async () => {
        const users = [
            { id: 1, name: 'Leanne Graham', email: 'a@a.com' },
            { id: 2, name: 'Ervin Howell', email: 'b@b.com' },
        ]

        globalThis.fetch = mockFetchOk(users)

        render(<App />)

        expect(screen.getByText('Loading...')).toBeInTheDocument()

        expect(await screen.findByText('Leanne Graham')).toBeInTheDocument()
        expect(screen.getByText('Ervin Howell')).toBeInTheDocument()
    })

    it('filters robots as you type and shows empty state', async () => {
        const users = [
            { id: 1, name: 'Leanne Graham', email: 'a@a.com' },
            { id: 2, name: 'Ervin Howell', email: 'b@b.com' },
        ]

        globalThis.fetch = mockFetchOk(users)

        render(<App />)

        await screen.findByText('Leanne Graham')

        const input = screen.getByPlaceholderText('search robots')
        const user = userEvent.setup()

        await user.type(input, 'leanne')

        expect(screen.getByText('Leanne Graham')).toBeInTheDocument()
        expect(screen.queryByText('Ervin Howell')).not.toBeInTheDocument()

        await user.clear(input)
        await user.type(input, 'zzzz')

        const empty = screen.getByText('No robots found.')
        expect(empty).toBeInTheDocument()
        expect(empty).toHaveClass('white')
    })

    it('falls back to local robots if the API fails, and can retry', async () => {
        globalThis.fetch = vi
            .fn()
            .mockRejectedValueOnce(new Error('offline'))
            .mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve([{ id: 99, name: 'API Robot', email: 'api@x.com' }]),
            })

        render(<App />)

        // Fallback path shows a warning and still renders the page
        expect(await screen.findByText(/Network issue:/i)).toBeInTheDocument()

        // Fallback data should render at least one known name
        expect(screen.getByText('Leanne Graham')).toBeInTheDocument()

        const user = userEvent.setup()
        await user.click(screen.getByRole('button', { name: /retry/i }))

        // After retry succeeds, it should show the API-provided robot
        expect(await screen.findByText('API Robot')).toBeInTheDocument()
    })
})
