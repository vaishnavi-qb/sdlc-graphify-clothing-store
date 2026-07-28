import { createSlice } from '@reduxjs/toolkit';

export const getItemKey = (item) => `${item.product}-${item.size}`;

const keysForItems = (items) => (items || []).map(getItemKey);

const sameItemKeys = (a, b) => {
  if (a.length !== b.length) return false;
  const setB = new Set(b);
  return a.every((key) => setB.has(key));
};

const initialState = {
  items: [],
  totalAmount: 0,
  totalQuantity: 0,
  // null means "all current items are selected" (default before any toggle)
  selectedKeys: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart: (state, action) => {
      const newItems = action.payload.items || [];
      const newKeys = keysForItems(newItems);
      const prevKeys = keysForItems(state.items);
      const contentChanged = !sameItemKeys(newKeys, prevKeys);

      state.items = newItems;
      state.totalAmount = action.payload.totalAmount || 0;
      state.totalQuantity = action.payload.totalQuantity || 0;

      if (contentChanged) {
        if (state.selectedKeys == null) {
          state.selectedKeys = null;
        } else {
          const prevSelected = new Set(state.selectedKeys);
          const prevKeySet = new Set(prevKeys);
          state.selectedKeys = newKeys.filter(
            (key) => prevSelected.has(key) || !prevKeySet.has(key)
          );
        }
      }
    },

    addToCart: (state, action) => {
      const newItem = action.payload;
      const itemQty = newItem.qty || 1;
      const key = getItemKey({
        product: newItem.product,
        size: newItem.size || '',
      });

      const existingItem = state.items.find(
        (item) => item.product === newItem.product && item.size === newItem.size
      );

      if (existingItem) {
        existingItem.qty += itemQty;
      } else {
        state.items.push({
          product: newItem.product,
          name: newItem.name,
          price: newItem.price,
          image: newItem.image,
          size: newItem.size || '',
          qty: itemQty,
        });
        if (state.selectedKeys != null) {
          state.selectedKeys.push(key);
        }
      }

      state.totalQuantity += itemQty;
      state.totalAmount += newItem.price * itemQty;
    },

    removeFromCart: (state, action) => {
      const { product, size } = action.payload;
      const key = getItemKey({ product, size });
      const existingItem = state.items.find(
        (item) => item.product === product && item.size === size
      );

      if (existingItem) {
        state.totalQuantity -= existingItem.qty;
        state.totalAmount -= existingItem.qty * existingItem.price;
        state.items = state.items.filter(
          (item) => !(item.product === product && item.size === size)
        );
        if (state.selectedKeys != null) {
          state.selectedKeys = state.selectedKeys.filter((k) => k !== key);
        }
      }
    },

    updateQuantity: (state, action) => {
      const { product, size, qty } = action.payload;
      const existingItem = state.items.find(
        (item) => item.product === product && item.size === size
      );

      if (existingItem && qty > 0) {
        const difference = qty - existingItem.qty;
        existingItem.qty = qty;
        state.totalQuantity += difference;
        state.totalAmount += difference * existingItem.price;
      }
    },

    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
      state.totalQuantity = 0;
      state.selectedKeys = null;
    },

    toggleItemSelection: (state, action) => {
      const key = action.payload;
      if (state.selectedKeys == null) {
        state.selectedKeys = keysForItems(state.items);
      }
      if (state.selectedKeys.includes(key)) {
        state.selectedKeys = state.selectedKeys.filter((k) => k !== key);
      } else {
        state.selectedKeys.push(key);
      }
    },

    selectAllItems: (state) => {
      state.selectedKeys = keysForItems(state.items);
    },

    clearItemSelection: (state) => {
      state.selectedKeys = [];
    },
  },
});

export const selectSelectedItems = (state) => {
  const { items, selectedKeys } = state.cart;
  if (selectedKeys == null) return items;
  const selected = new Set(selectedKeys);
  return items.filter((item) => selected.has(getItemKey(item)));
};

export const selectSelectedAmount = (state) =>
  selectSelectedItems(state).reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

export const selectAreAllItemsSelected = (state) => {
  const { items, selectedKeys } = state.cart;
  if (items.length === 0) return false;
  if (selectedKeys == null) return true;
  if (selectedKeys.length !== items.length) return false;
  const selected = new Set(selectedKeys);
  return items.every((item) => selected.has(getItemKey(item)));
};

export const selectIsItemSelected = (state, item) => {
  const { selectedKeys } = state.cart;
  if (selectedKeys == null) return true;
  return selectedKeys.includes(getItemKey(item));
};

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  setCart,
  toggleItemSelection,
  selectAllItems,
  clearItemSelection,
} = cartSlice.actions;

export default cartSlice.reducer;
