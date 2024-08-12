import { onAuthStateChanged } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebaseConfig";

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  farmerName?: string;
}

interface TraderDemand {
  id: string;
  cropName: string;
  price: number;
  traderName: string;
}

const FarmerPage: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [newItem, setNewItem] = useState<
    Omit<InventoryItem, "id" | "farmerName">
  >({
    name: "",
    quantity: 0,
    price: 0,
  });
  const [cropsForSale, setCropsForSale] = useState<InventoryItem[]>([]);
  const [traderDemands, setTraderDemands] = useState<TraderDemand[]>([]);
  const [farmerName, setFarmerName] = useState<string | null>(null);

  useEffect(() => {
    const fetchFarmerName = async () => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          try {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
              setFarmerName(userDoc.data().name);
            }
          } catch (error) {
            console.error("Error fetching user:", error);
          }
        }
      });

      return () => unsubscribe();
    };

    fetchFarmerName();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [inventorySnapshot, cropsForSaleSnapshot, traderDemandsSnapshot] =
          await Promise.all([
            getDocs(collection(db, "inventory")),
            getDocs(collection(db, "cropsForSale")),
            getDocs(collection(db, "cropDemands")),
          ]);

        setInventory(
          inventorySnapshot.docs.map(
            (doc) => ({ id: doc.id, ...doc.data() } as InventoryItem)
          )
        );
        setCropsForSale(
          cropsForSaleSnapshot.docs.map(
            (doc) => ({ id: doc.id, ...doc.data() } as InventoryItem)
          )
        );
        setTraderDemands(
          traderDemandsSnapshot.docs.map(
            (doc) => ({ id: doc.id, ...doc.data() } as TraderDemand)
          )
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleAddItem = async () => {
    if (newItem.name && newItem.quantity > 0 && newItem.price > 0) {
      try {
        const docRef = await addDoc(collection(db, "inventory"), newItem);
        setInventory((prevInventory) => [
          ...prevInventory,
          { id: docRef.id, ...newItem },
        ]);
        setNewItem({ name: "", quantity: 0, price: 0 });
      } catch (error) {
        console.error("Error adding item:", error);
      }
    }
  };

  const handleAddCropForSale = async () => {
    if (
      newItem.name &&
      newItem.quantity > 0 &&
      newItem.price > 0 &&
      farmerName
    ) {
      try {
        const cropForSale = { ...newItem, farmerName };
        const docRef = await addDoc(
          collection(db, "cropsForSale"),
          cropForSale
        );
        setCropsForSale((prevCrops) => [
          ...prevCrops,
          { id: docRef.id, ...cropForSale },
        ]);
        setNewItem({ name: "", quantity: 0, price: 0 });
      } catch (error) {
        console.error("Error adding crop for sale:", error);
      }
    }
  };

  const handleUpdateItem = async (
    id: string,
    quantity: number,
    price: number
  ) => {
    try {
      const itemRef = doc(db, "inventory", id);
      await updateDoc(itemRef, { quantity, price });
      setInventory((prevInventory) =>
        prevInventory.map((item) =>
          item.id === id ? { ...item, quantity, price } : item
        )
      );
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  const handleUpdateCropPrice = async (id: string, price: number) => {
    try {
      const cropRef = doc(db, "cropsForSale", id);
      await updateDoc(cropRef, { price });
      setCropsForSale((prevCrops) =>
        prevCrops.map((crop) => (crop.id === id ? { ...crop, price } : crop))
      );
    } catch (error) {
      console.error("Error updating crop price:", error);
    }
  };

  const handleSellCrop = async (id: string, quantity: number) => {
    const crop = cropsForSale.find((crop) => crop.id === id);
    if (crop) {
      const newQuantity = crop.quantity - quantity;
      if (newQuantity >= 0) {
        try {
          const cropRef = doc(db, "cropsForSale", id);
          await updateDoc(cropRef, { quantity: newQuantity });
          setCropsForSale((prevCrops) =>
            prevCrops.map((c) =>
              c.id === id ? { ...c, quantity: newQuantity } : c
            )
          );
        } catch (error) {
          console.error("Error selling crop:", error);
        }
      } else {
        alert("Not enough quantity available.");
      }
    }
  };

  const totalInventoryItems = inventory.length;
  const totalCropsForSale = cropsForSale.reduce(
    (acc, crop) => acc + crop.quantity,
    0
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-10 text-center">
        Farmer Dashboard
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-10">
        <div className="bg-white shadow-lg rounded-xl p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Dashboard Stats
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-6 rounded-md shadow-sm flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-700">
                  Total Inventory Items
                </h3>
                <p className="text-2xl font-bold text-gray-900">
                  {totalInventoryItems}
                </p>
              </div>
              <div className="bg-blue-600 text-white p-3 rounded-full">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 5h16M4 10h16M4 15h16M4 20h16"
                  ></path>
                </svg>
              </div>
            </div>
            <div className="bg-green-50 p-6 rounded-md shadow-sm flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-700">
                  Total Crops for Sale
                </h3>
                <p className="text-2xl font-bold text-gray-900">
                  {totalCropsForSale}
                </p>
              </div>
              <div className="bg-green-600 text-white p-3 rounded-full">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 12h14M12 5l7 7-7 7"
                  ></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-10">
        {/* Add to Inventory */}
        <section className="bg-white shadow-lg rounded-xl p-8">
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
                  setNewItem((prev) => ({ ...prev, name: e.target.value }))
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
                  setNewItem((prev) => ({
                    ...prev,
                    quantity: parseInt(e.target.value, 10),
                  }))
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
                  setNewItem((prev) => ({
                    ...prev,
                    price: parseFloat(e.target.value),
                  }))
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
        </section>

        {/* Add Crops for Sale */}
        <section className="bg-white shadow-lg rounded-xl p-8">
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
                  setNewItem((prev) => ({ ...prev, name: e.target.value }))
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
                  setNewItem((prev) => ({
                    ...prev,
                    quantity: parseInt(e.target.value, 10),
                  }))
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
                  setNewItem((prev) => ({
                    ...prev,
                    price: parseFloat(e.target.value),
                  }))
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
        </section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Inventory List */}
        <section className="bg-white shadow-lg rounded-xl p-8">
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
        </section>

        {/* Crops for Sale */}
        <section className="bg-white shadow-lg rounded-xl p-8">
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
                <p className="text-gray-600">Farmer: {crop.farmerName}</p>
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
        </section>

        {/* Trader Demands */}
        <section className="bg-white shadow-lg rounded-xl p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Trader Demands
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {traderDemands.map((demand) => (
              <div
                key={demand.id}
                className="bg-white shadow-md rounded-lg p-6 space-y-2"
              >
                <h3 className="text-xl font-bold text-gray-700">
                  {demand.cropName}
                </h3>
                <p className="text-gray-600">
                  Price: ${demand.price.toFixed(2)}
                </p>
                <p className="text-gray-600">Trader: {demand.traderName}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default FarmerPage;
