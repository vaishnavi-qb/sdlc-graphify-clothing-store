import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import Cart from './Cart'
import Checkout from './Checkout'
import cartReducer from '../store/cartSlice'
import authReducer from '../store/authSlice'

vi.mock('../components/Navbar', () => ({
  default: () => <div data-testid="navbar" />,
}))

vi.mock('../components/Footer', () => ({
  default: () => <div data-testid="footer" />,
}))

vi.mock('../services/axios', () => ({
  default: {
    get: vi.fn().mockResolvedValue({ data: { address: [], cartItems: [] } }),
    delete: vi.fn().mockResolvedValue({ data: {} }),
    patch: vi.fn().mockResolvedValue({ data: {} }),
    post: vi.fn().mockResolvedValue({ data: {} }),
  },
}))

vi.mock('@stripe/stripe-js', () => ({
  loadStripe: vi.fn().mockResolvedValue(null),
}))

const shirt = {
  product: 'prod-shirt',
  name: 'Classic Shirt',
  price: 20,
  image: '/shirt.jpg',
  size: 'M',
  qty: 1,
}

const pants = {
  product: 'prod-pants',
  name: 'Denim Pants',
  price: 40,
  image: '/pants.jpg',
  size: 'L',
  qty: 2,
}

const cartItems = [shirt, pants]
const cartTotalAmount = shirt.price * shirt.qty + pants.price * pants.qty

function createStore(overrides = {}) {
  return configureStore({
    reducer: {
      auth: authReducer,
      cart: cartReducer,
    },
    preloadedState: {
      auth: {
        user: { name: 'Shopper' },
        token: 'test-token',
        isAuthenticated: true,
        ...overrides.auth,
      },
      cart: {
        items: cartItems,
        totalAmount: cartTotalAmount,
        totalQuantity: shirt.qty + pants.qty,
        ...overrides.cart,
      },
    },
  })
}

function renderCart(store, { withCheckout = false } = {}) {
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/cart']}>
        {withCheckout ? (
          <Routes>
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
        ) : (
          <Cart />
        )}
      </MemoryRouter>
    </Provider>
  )
}

function getItemCheckboxes() {
  return screen.getAllByRole('checkbox').filter(
    (el) => el.getAttribute('aria-label') !== 'Select all items'
  )
}

function getSelectAllCheckbox() {
  return screen.getByRole('checkbox', { name: /select all/i })
}

function getTotalsSection() {
  return screen.getByRole('heading', { name: /cart totals/i }).closest('div')
}

describe('Cart item selection for checkout', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('displays a checkbox for every cart line item', () => {
    const store = createStore()
    renderCart(store)

    expect(getItemCheckboxes()).toHaveLength(cartItems.length)
  })

  it('selects all cart items by default when the cart page loads', () => {
    const store = createStore()
    renderCart(store)

    for (const checkbox of getItemCheckboxes()) {
      expect(checkbox).toBeChecked()
    }
  })

  it('allows checking and unchecking individual cart items', async () => {
    const user = userEvent.setup()
    const store = createStore()
    renderCart(store)

    const [shirtCheckbox] = getItemCheckboxes()
    expect(shirtCheckbox).toBeChecked()

    await user.click(shirtCheckbox)
    expect(shirtCheckbox).not.toBeChecked()

    await user.click(shirtCheckbox)
    expect(shirtCheckbox).toBeChecked()
  })

  it('selects every cart item when Select All is checked', async () => {
    const user = userEvent.setup()
    const store = createStore()
    renderCart(store)

    for (const checkbox of getItemCheckboxes()) {
      await user.click(checkbox)
    }
    expect(getItemCheckboxes().every((c) => !c.checked)).toBe(true)

    await user.click(getSelectAllCheckbox())

    for (const checkbox of getItemCheckboxes()) {
      expect(checkbox).toBeChecked()
    }
  })

  it('clears every cart item selection when Select All is unchecked', async () => {
    const user = userEvent.setup()
    const store = createStore()
    renderCart(store)

    await user.click(getSelectAllCheckbox())

    for (const checkbox of getItemCheckboxes()) {
      expect(checkbox).not.toBeChecked()
    }
  })

  it('reflects whether all items are selected in the Select All control', async () => {
    const user = userEvent.setup()
    const store = createStore()
    renderCart(store)

    const selectAll = getSelectAllCheckbox()
    expect(selectAll).toBeChecked()

    await user.click(getItemCheckboxes()[0])
    expect(selectAll).not.toBeChecked()

    await user.click(getItemCheckboxes()[0])
    expect(selectAll).toBeChecked()
  })

  it('calculates cart page totals from selected items only', async () => {
    const user = userEvent.setup()
    const store = createStore()
    renderCart(store)

    const [, pantsCheckbox] = getItemCheckboxes()
    await user.click(pantsCheckbox)

    const totals = getTotalsSection()
    expect(within(totals).getByText('$20.00')).toBeInTheDocument()
    expect(within(totals).queryByText('$100.00')).not.toBeInTheDocument()
  })

  it('sends only selected items to the checkout page', async () => {
    const user = userEvent.setup()
    const store = createStore()
    renderCart(store, { withCheckout: true })

    const [, pantsCheckbox] = getItemCheckboxes()
    await user.click(pantsCheckbox)

    await user.click(screen.getByRole('button', { name: /proceed to checkout/i }))

    expect(await screen.findByText(/order summary/i)).toBeInTheDocument()
    expect(screen.getByText(/classic shirt/i)).toBeInTheDocument()
    expect(screen.queryByText(/denim pants/i)).not.toBeInTheDocument()
  })

  it('blocks checkout and shows a validation message when no items are selected', async () => {
    const user = userEvent.setup()
    const store = createStore()
    renderCart(store, { withCheckout: true })

    await user.click(getSelectAllCheckbox())
    expect(getItemCheckboxes().every((c) => !c.checked)).toBe(true)

    await user.click(screen.getByRole('button', { name: /proceed to checkout/i }))

    expect(
      screen.getByText(/select at least one item/i)
    ).toBeInTheDocument()
    expect(screen.queryByText(/order summary/i)).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /proceed to checkout/i })).toBeInTheDocument()
  })

  it('keeps unselected items in the cart after proceeding with selected items', async () => {
    const user = userEvent.setup()
    const store = createStore()
    renderCart(store, { withCheckout: true })

    const [, pantsCheckbox] = getItemCheckboxes()
    await user.click(pantsCheckbox)

    await user.click(screen.getByRole('button', { name: /proceed to checkout/i }))
    await screen.findByText(/order summary/i)

    const remaining = store.getState().cart.items
    expect(remaining).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ product: shirt.product, size: shirt.size }),
        expect.objectContaining({ product: pants.product, size: pants.size }),
      ])
    )
    expect(remaining).toHaveLength(2)
  })

  it('persists item selection across in-app navigation until cart content changes', async () => {
    const user = userEvent.setup()
    const store = createStore()
    const { unmount } = renderCart(store)

    await user.click(getItemCheckboxes()[1])
    expect(getItemCheckboxes()[1]).not.toBeChecked()

    unmount()
    renderCart(store)

    expect(getItemCheckboxes()[0]).toBeChecked()
    expect(getItemCheckboxes()[1]).not.toBeChecked()
  })

  it('updates selection safely when a selected item is removed from the cart', async () => {
    const user = userEvent.setup()
    const store = createStore()
    renderCart(store)

    expect(getItemCheckboxes()).toHaveLength(2)

    const removeButtons = screen.getAllByRole('button', { name: /remove item/i })
    await user.click(removeButtons[0])

    expect(getItemCheckboxes()).toHaveLength(1)
    expect(getItemCheckboxes()[0]).toBeChecked()
    expect(getSelectAllCheckbox()).toBeChecked()
    expect(screen.getByText(/denim pants/i)).toBeInTheDocument()
    expect(screen.queryByText(/classic shirt/i)).not.toBeInTheDocument()
  })
})
