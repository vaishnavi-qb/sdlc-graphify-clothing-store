import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { X, AlertCircle } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import {
  removeFromCart,
  updateQuantity,
  setCart,
  toggleItemSelection,
  selectAllItems,
  clearItemSelection,
  getItemKey,
  selectSelectedItems,
  selectSelectedAmount,
  selectAreAllItemsSelected,
} from '../store/cartSlice'
import '../styles/Cart.scss'
import api from '../services/axios'

const Cart = () => {
  const [promoCode, setPromoCode] = useState('')
  const [editingItem, setEditingItem] = useState(null)
  const [tempQuantities, setTempQuantities] = useState({})
  const [checkoutError, setCheckoutError] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { isAuthenticated } = useSelector((state) => state.auth)
  const { items, selectedKeys } = useSelector((state) => state.cart)
  const selectedItems = useSelector(selectSelectedItems)
  const selectedAmount = useSelector(selectSelectedAmount)
  const allSelected = useSelector(selectAreAllItemsSelected)

  const shippingFee = 0
  const total = selectedAmount + shippingFee

  const isItemSelected = (item) => {
    if (selectedKeys == null) return true
    return selectedKeys.includes(getItemKey(item))
  }

  useEffect(() => {
    const fetchCart = async () => {
      if (isAuthenticated) {
        try {
          const response = await api.get('/cart')
          console.log('Fetched cart items:', response.data)

          const cartItems = response.data.cartItems || []
          // Keep the in-memory cart when the API returns an empty list so
          // locally staged / preloaded items (and their selection) are not wiped.
          if (cartItems.length === 0) {
            return
          }

          const totalAmount = response.data.itemsPrice || 0
          const totalQuantity = cartItems.reduce((acc, item) => acc + item.qty, 0)

          const dbCartData = {
            items: cartItems,
            totalAmount: totalAmount,
            totalQuantity: totalQuantity,
          }

          dispatch(setCart(dbCartData))
        } catch (error) {
          console.error('Failed to fetch cart:', error)
        }
      }
    }

    fetchCart()
  }, [isAuthenticated, dispatch])

  const handleRemoveItem = async (product, size) => {
    dispatch(removeFromCart({ product, size }))

    console.log('Removing item from cart:', { product, size })
    if (isAuthenticated) {
      try {
        await api.delete(`/cart/${product}?size=${size}`, { data: { product, size } })
      } catch (error) {
        console.error('Failed to remove item from server:', error)
      }
    }
  }

  const handleQuantityChange = async (product, size, newQuantity) => {
    if (newQuantity > 0) {
      const itemKey = `${product}-${size}`
      setTempQuantities((prev) => ({
        ...prev,
        [itemKey]: newQuantity,
      }))
      setEditingItem(itemKey)
    }
  }

  const handleSaveQuantity = async (product, size) => {
    const itemKey = `${product}-${size}`
    const newQuantity = tempQuantities[itemKey]

    if (newQuantity && newQuantity > 0) {
      dispatch(updateQuantity({ product, size, qty: newQuantity }))

      if (isAuthenticated) {
        try {
          await api.patch(`/cart/${product}?size=${size}`, { qty: newQuantity })
        } catch (error) {
          console.error('Failed to update quantity on server:', error)
        }
      }
    }

    setEditingItem(null)
    setTempQuantities((prev) => {
      const updated = { ...prev }
      delete updated[itemKey]
      return updated
    })
  }

  const handleCancelQuantity = (product, size) => {
    const itemKey = `${product}-${size}`

    setEditingItem(null)
    setTempQuantities((prev) => {
      const updated = { ...prev }
      delete updated[itemKey]
      return updated
    })
  }

  const handleToggleItem = (item) => {
    setCheckoutError('')
    dispatch(toggleItemSelection(getItemKey(item)))
  }

  const handleSelectAllChange = (event) => {
    setCheckoutError('')
    if (event.target.checked) {
      dispatch(selectAllItems())
    } else {
      dispatch(clearItemSelection())
    }
  }

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    if (selectedItems.length === 0) {
      setCheckoutError('Please select at least one item to proceed to checkout.')
      return
    }
    setCheckoutError('')
    navigate('/checkout')
  }

  return (
    <div className="cart-page">
      <Navbar />

      <main className="cart-main">
        {!isAuthenticated && (
          <div className="auth-warning">
            <AlertCircle className="warning-icon" />
            <p>
              Please <Link to="/login">login</Link> to save your cart and proceed with checkout.
            </p>
          </div>
        )}

        {items.length === 0 ? (
          <div className="empty-cart">
            <h2>Your cart is empty</h2>
            <p>Add some products to get started!</p>
            <Link to="/" className="continue-shopping-btn">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-table-wrapper">
              <div className="cart-select-all">
                <label>
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={handleSelectAllChange}
                    aria-label="Select all items"
                  />
                  Select All
                </label>
              </div>
              <table className="cart-table">
                <thead>
                  <tr>
                    <th>Select</th>
                    <th>Products</th>
                    <th>Title</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => {
                    const itemKey = getItemKey(item)
                    const isEditing = editingItem === itemKey
                    const displayQty = isEditing ? tempQuantities[itemKey] : item.qty

                    return (
                      <tr key={itemKey}>
                        <td>
                          <input
                            type="checkbox"
                            checked={isItemSelected(item)}
                            onChange={() => handleToggleItem(item)}
                            aria-label={`Select ${item.name}`}
                          />
                        </td>
                        <td>
                          <div className="product-image-cell">
                            <img src={item.image} alt={item.name} />
                          </div>
                        </td>
                        <td>
                          <div className="product-title">
                            {item.name}
                            {item.size && (
                              <span className="product-size">Size: {item.size}</span>
                            )}
                          </div>
                        </td>
                        <td className="price-cell">$ {item.price}</td>
                        <td>
                          <div className="quantity-control-wrapper">
                            <input
                              type="number"
                              min="1"
                              value={displayQty}
                              onChange={(e) =>
                                handleQuantityChange(
                                  item.product,
                                  item.size,
                                  parseInt(e.target.value) || 1
                                )
                              }
                              className="quantity-input"
                            />
                            {isEditing && (
                              <div className="quantity-actions">
                                <button
                                  className="save-btn"
                                  onClick={() => handleSaveQuantity(item.product, item.size)}
                                  title="Save"
                                >
                                  ✓
                                </button>
                                <button
                                  className="cancel-btn"
                                  onClick={() => handleCancelQuantity(item.product, item.size)}
                                  title="Cancel"
                                >
                                  ✕
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="total-cell">$ {(item.price * item.qty).toFixed(2)}</td>
                        <td>
                          <button
                            className="remove-btn"
                            onClick={() => handleRemoveItem(item.product, item.size)}
                            aria-label="Remove item"
                          >
                            <X />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div className="cart-summary-wrapper">
              <div className="cart-totals">
                <h2>Cart Totals</h2>

                <div className="totals-row">
                  <span>Subtotal</span>
                  <span className="amount">{`$${selectedAmount.toFixed(2)}`}</span>
                </div>

                <div className="totals-row">
                  <span>Shipping Fee</span>
                  <span className="amount">{shippingFee === 0 ? 'Free' : `$${shippingFee}`}</span>
                </div>

                <div className="totals-row total">
                  <span>Total</span>
                  <span className="amount amount-total">{total.toFixed(2)}</span>
                </div>

                {checkoutError && (
                  <p className="checkout-validation-error" role="alert">
                    {checkoutError}
                  </p>
                )}

                <button className="checkout-btn" onClick={handleCheckout}>
                  PROCEED TO CHECKOUT
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

export default Cart
