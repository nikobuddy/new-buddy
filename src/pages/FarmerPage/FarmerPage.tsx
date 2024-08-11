import {
  addDoc,
  collection,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../firebaseConfig"; // Adjust the import according to your file structure

// Define interfaces for the data structures
interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

const FarmerPage: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [newItem, setNewItem] = useState<Omit<InventoryItem, "id">>({
    name: "",
    quantity: 0,
    price: 0,
  });
  const [cropsForSale, setCropsForSale] = useState<InventoryItem[]>([]);
  const [traderPrices, setTraderPrices] = useState<{ [key: string]: number }>(
    {}
  );

  // Fetch data from Firestore on component mount
  useEffect(() => {
    const fetchInventory = async () => {
      const querySnapshot = await getDocs(collection(db, "inventory"));
      const items = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as InventoryItem[];
      setInventory(items);
    };

    const fetchCropsForSale = async () => {
      const querySnapshot = await getDocs(collection(db, "cropsForSale"));
      const crops = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as InventoryItem[];
      setCropsForSale(crops);
    };

    const fetchTraderPrices = async () => {
      const querySnapshot = await getDocs(collection(db, "traderPrices"));
      const prices = querySnapshot.docs.reduce((acc, doc) => {
        acc[doc.id] = doc.data().price as number;
        return acc;
      }, {} as { [key: string]: number });
      setTraderPrices(prices);
    };

    fetchInventory();
    fetchCropsForSale();
    fetchTraderPrices();
  }, []);

  // Handle adding a new item to inventory
  const handleAddItem = async () => {
    if (newItem.name && newItem.quantity > 0 && newItem.price > 0) {
      const docRef = await addDoc(collection(db, "inventory"), newItem);
      setInventory([...inventory, { id: docRef.id, ...newItem }]);
      setNewItem({ name: "", quantity: 0, price: 0 });
    }
  };

  // Handle adding a new crop for sale
  const handleAddCropForSale = async () => {
    if (newItem.name && newItem.quantity > 0 && newItem.price > 0) {
      const docRef = await addDoc(collection(db, "cropsForSale"), newItem);
      setCropsForSale([...cropsForSale, { id: docRef.id, ...newItem }]);
      setNewItem({ name: "", quantity: 0, price: 0 });
    }
  };

  // Handle updating an item's quantity and price
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

  // Handle updating the price of a crop for sale
  const handleUpdateCropPrice = async (id: string, price: number) => {
    const cropRef = doc(db, "cropsForSale", id);
    await updateDoc(cropRef, { price });
    setCropsForSale(
      cropsForSale.map((crop) => (crop.id === id ? { ...crop, price } : crop))
    );
  };

  // Handle selling a crop by reducing its quantity
  const handleSellCrop = async (id: string, quantity: number) => {
    const crop = cropsForSale.find((crop) => crop.id === id);
    if (crop) {
      const newQuantity = crop.quantity - quantity;
      if (newQuantity >= 0) {
        const cropRef = doc(db, "cropsForSale", id);
        await updateDoc(cropRef, { quantity: newQuantity });
        setCropsForSale(
          cropsForSale.map((c) =>
            c.id === id ? { ...c, quantity: newQuantity } : c
          )
        );
      } else {
        alert("Not enough quantity available.");
      }
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-10 text-center">
        Farmer Dashboard
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Add to Inventory */}
        <div className="bg-white shadow-lg rounded-xl p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
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
                  setNewItem({
                    ...newItem,
                    quantity: parseInt(e.target.value, 10),
                  })
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
                  setNewItem({
                    ...newItem,
                    price: parseFloat(e.target.value),
                  })
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

        {/* Add Crops for Sale */}
        <div className="bg-white shadow-lg rounded-xl p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Add Crops for Sale
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Crop Name
              </label>
              <input
                type="text"
                placeholder="Crop Name"
                value={newItem.name}
                onChange={(e) =>
                  setNewItem({ ...newItem, name: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
                  setNewItem({
                    ...newItem,
                    quantity: parseInt(e.target.value, 10),
                  })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
                  setNewItem({
                    ...newItem,
                    price: parseFloat(e.target.value),
                  })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <button
              onClick={handleAddCropForSale}
              className="w-full bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition"
            >
              Add Crop for Sale
            </button>
          </div>
        </div>

        {/* Inventory List */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Inventory
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {inventory.map((item) => (
              <div
                key={item.id}
                className="bg-white shadow-md rounded-lg p-6 space-y-2"
              >
                <h3 className="text-xl font-bold text-gray-700">{item.name}</h3>
                <p className="text-gray-600">Quantity: {item.quantity}</p>
                <p className="text-gray-600">Price: ${item.price.toFixed(2)}</p>
                <button
                  onClick={() =>
                    handleUpdateItem(
                      item.id,
                      item.quantity,
                      parseFloat(
                        prompt(
                          `Enter new price for ${item.name}`,
                          item.price.toString()
                        ) || item.price.toString()
                      )
                    )
                  }
                  className="w-full bg-yellow-500 text-white p-2 rounded-lg hover:bg-yellow-600 transition"
                >
                  Update Price
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Crops for Sale */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Crops for Sale
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cropsForSale.map((crop) => (
              <div
                key={crop.id}
                className="bg-white shadow-md rounded-lg p-6 space-y-2"
              >
                <h3 className="text-xl font-bold text-gray-700">{crop.name}</h3>
                <p className="text-gray-600">Quantity: {crop.quantity}</p>
                <p className="text-gray-600">Price: ${crop.price.toFixed(2)}</p>
                <button
                  onClick={() =>
                    handleUpdateCropPrice(
                      crop.id,
                      parseFloat(
                        prompt(
                          `Enter new price for ${crop.name}`,
                          crop.price.toString()
                        ) || crop.price.toString()
                      )
                    )
                  }
                  className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
                >
                  Update Price
                </button>
                <button
                  onClick={() =>
                    handleSellCrop(
                      crop.id,
                      parseInt(
                        prompt(
                          `Enter quantity to sell for ${crop.name}`,
                          "0"
                        ) || "0",
                        10
                      )
                    )
                  }
                  className="w-full bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition mt-2"
                >
                  Sell Crop
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerPage;
