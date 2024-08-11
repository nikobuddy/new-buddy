import {
  addDoc,
  collection,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../firebaseConfig"; // Import your Firebase configuration

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

const DistributorPage: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [newItem, setNewItem] = useState({ name: "", quantity: 0, price: 0 });
  const [orders, setOrders] = useState<InventoryItem[]>([]); // Assuming orders are similar to inventory items

  useEffect(() => {
    const fetchInventory = async () => {
      const querySnapshot = await getDocs(collection(db, "inventory"));
      const items = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as InventoryItem[];
      setInventory(items);
    };

    const fetchOrders = async () => {
      const querySnapshot = await getDocs(collection(db, "orders")); // Replace with your orders collection
      const ordersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as InventoryItem[];
      setOrders(ordersData);
    };

    fetchInventory();
    fetchOrders();
  }, []);

  const handleAddItem = async () => {
    if (newItem.name && newItem.quantity > 0 && newItem.price > 0) {
      const docRef = await addDoc(collection(db, "inventory"), newItem);
      setInventory([...inventory, { id: docRef.id, ...newItem }]);
      setNewItem({ name: "", quantity: 0, price: 0 });
    }
  };

  const handleUpdateItem = async (
    id: string,
    quantity: number,
    price: number
  ) => {
    const itemRef = doc(db, "inventory", id);
    await updateDoc(itemRef, { quantity, price });
    setInventory(
      inventory.map((item) =>
        item.id === id ? { ...item, quantity, price } : item
      )
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-6">
        Distributor Dashboard
      </h1>
      <p className="mb-8 text-gray-600">
        Welcome, Distributor! Manage your inventory and view your orders here.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Add to Inventory */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Add to Inventory
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Item Name
              </label>
              <input
                type="text"
                placeholder="Item Name"
                value={newItem.name}
                onChange={(e) =>
                  setNewItem({ ...newItem, name: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Quantity
              </label>
              <input
                type="number"
                placeholder="Quantity"
                value={newItem.quantity}
                onChange={(e) =>
                  setNewItem({ ...newItem, quantity: parseInt(e.target.value) })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Price
              </label>
              <input
                type="number"
                placeholder="Price"
                value={newItem.price}
                onChange={(e) =>
                  setNewItem({ ...newItem, price: parseFloat(e.target.value) })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={handleAddItem}
              className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition"
            >
              Add Item
            </button>
          </div>
        </div>
      </div>

      {/* Inventory */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Inventory</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {inventory.map((item) => (
            <div key={item.id} className="bg-white shadow-lg rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800">
                {item.name}
              </h3>
              <p className="text-gray-600">Quantity: {item.quantity}</p>
              <p className="text-gray-600">Price: ${item.price.toFixed(2)}</p>
              <div className="mt-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  Update Quantity
                </label>
                <input
                  type="number"
                  placeholder="Update Quantity"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
                  onChange={(e) =>
                    handleUpdateItem(
                      item.id,
                      parseInt(e.target.value),
                      item.price
                    )
                  }
                />
                <label className="block text-gray-700 font-semibold mb-2">
                  Update Price
                </label>
                <input
                  type="number"
                  placeholder="Update Price"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  onChange={(e) =>
                    handleUpdateItem(
                      item.id,
                      item.quantity,
                      parseFloat(e.target.value)
                    )
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Orders */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Orders</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white shadow-lg rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800">
                {order.name}
              </h3>
              <p className="text-gray-600">Quantity: {order.quantity}</p>
              <p className="text-gray-600">Price: ${order.price.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DistributorPage;
