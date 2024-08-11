import {
  addDoc,
  collection,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../firebaseConfig"; // Import your Firebase configuration

interface CropItem {
  id: string;
  farmerName: string;
  cropName: string;
  quantity: number;
  farmerPrice: number;
  traderPrice?: number; // Optional for storing trader price
  forSale?: boolean; // Optional, indicates if the crop is for sale
}

const TraderPage: React.FC = () => {
  const [crops, setCrops] = useState<CropItem[]>([]);
  const [cropsForSale, setCropsForSale] = useState<CropItem[]>([]);
  const [newTraderPrice, setNewTraderPrice] = useState<{
    cropId: string;
    price: number;
  }>({ cropId: "", price: 0 });
  const [newInventoryItem, setNewInventoryItem] = useState({
    cropName: "",
    quantity: 0,
    traderPrice: 0,
  });
  const [editingItem, setEditingItem] = useState<CropItem | null>(null);

  useEffect(() => {
    const fetchCrops = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "crops"));
        const cropData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as CropItem[];
        setCrops(cropData);

        // Filter crops that are for sale
        const saleCrops = cropData.filter((crop) => crop.forSale);
        setCropsForSale(saleCrops);
      } catch (error) {
        console.error("Error fetching crops: ", error);
      }
    };

    fetchCrops();
  }, []);

  const handleUpdatePrice = async (id: string, price: number) => {
    const cropRef = doc(db, "crops", id);
    await updateDoc(cropRef, { traderPrice: price });
    setCrops(
      crops.map((crop) =>
        crop.id === id ? { ...crop, traderPrice: price } : crop
      )
    );
  };

  const handleAddTraderPrice = async () => {
    if (newTraderPrice.cropId && newTraderPrice.price > 0) {
      const crop = crops.find((crop) => crop.id === newTraderPrice.cropId);
      if (crop) {
        await updateDoc(doc(db, "crops", newTraderPrice.cropId), {
          traderPrice: newTraderPrice.price,
        });
        setCrops(
          crops.map((crop) =>
            crop.id === newTraderPrice.cropId
              ? { ...crop, traderPrice: newTraderPrice.price }
              : crop
          )
        );
        setNewTraderPrice({ cropId: "", price: 0 });
      }
    }
  };

  const handleAddInventoryItem = async () => {
    if (
      newInventoryItem.cropName &&
      newInventoryItem.quantity > 0 &&
      newInventoryItem.traderPrice > 0
    ) {
      const docRef = await addDoc(collection(db, "crops"), {
        farmerName: "Trader", // Assuming trader adds inventory under their name
        cropName: newInventoryItem.cropName,
        quantity: newInventoryItem.quantity,
        traderPrice: newInventoryItem.traderPrice,
        farmerPrice: 0, // Optional, depending on your data structure
      });
      setCrops([
        ...crops,
        {
          id: docRef.id,
          farmerName: "Trader",
          cropName: newInventoryItem.cropName,
          quantity: newInventoryItem.quantity,
          traderPrice: newInventoryItem.traderPrice,
          farmerPrice: 0,
        },
      ]);
      setNewInventoryItem({ cropName: "", quantity: 0, traderPrice: 0 });
    }
  };

  const handleEditItem = (item: CropItem) => {
    setEditingItem(item);
  };

  const handleUpdateInventoryItem = async () => {
    if (editingItem) {
      const cropRef = doc(db, "crops", editingItem.id);
      await updateDoc(cropRef, {
        cropName: editingItem.cropName,
        quantity: editingItem.quantity,
        traderPrice: editingItem.traderPrice,
      });
      setCrops(
        crops.map((crop) => (crop.id === editingItem.id ? editingItem : crop))
      );
      setEditingItem(null); // Reset editing state
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-6">
        Trader Dashboard
      </h1>
      <p className="mb-8 text-gray-600">
        Welcome, Trader! Review the crops available for purchase, manage your
        inventory, and set your prices.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Manage Crops */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Manage Inventory
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Crop Name
              </label>
              <input
                type="text"
                placeholder="Crop Name"
                value={newInventoryItem.cropName}
                onChange={(e) =>
                  setNewInventoryItem({
                    ...newInventoryItem,
                    cropName: e.target.value,
                  })
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
                value={newInventoryItem.quantity}
                onChange={(e) =>
                  setNewInventoryItem({
                    ...newInventoryItem,
                    quantity: parseInt(e.target.value),
                  })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Trader Price
              </label>
              <input
                type="number"
                placeholder="Trader Price"
                value={newInventoryItem.traderPrice}
                onChange={(e) =>
                  setNewInventoryItem({
                    ...newInventoryItem,
                    traderPrice: parseFloat(e.target.value),
                  })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={handleAddInventoryItem}
              className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition"
            >
              Add to Inventory
            </button>
          </div>
        </div>
      </div>

      {/* View and Update Inventory */}
      <div className="mt-8 bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          View and Update Inventory
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {crops.map((crop) => (
            <div
              key={crop.id}
              className="border border-gray-300 p-4 rounded-lg space-y-2"
            >
              <h3 className="text-lg font-bold text-gray-700">
                {crop.cropName}
              </h3>
              <p className="text-gray-600">Quantity: {crop.quantity}</p>
              <p className="text-gray-600">Trader Price: ${crop.traderPrice}</p>
              <p className="text-gray-600">Farmer: {crop.farmerName}</p>
              <button
                onClick={() => handleEditItem(crop)}
                className="mt-2 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Crops for Sale */}
      <div className="mt-8 bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Crops for Sale
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cropsForSale.map((crop) => (
            <div
              key={crop.id}
              className="border border-gray-300 p-4 rounded-lg space-y-2"
            >
              <h3 className="text-lg font-bold text-gray-700">
                {crop.cropName}
              </h3>
              <p className="text-gray-600">Quantity: {crop.quantity}</p>
              <p className="text-gray-600">Farmer Price: ${crop.farmerPrice}</p>
              <p className="text-gray-600">Farmer: {crop.farmerName}</p>
              {/* You can add buttons or other functionality here */}
            </div>
          ))}
        </div>
      </div>

      {/* Edit Item Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">Edit Item</h3>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Crop Name
              </label>
              <input
                type="text"
                value={editingItem.cropName}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, cropName: e.target.value })
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
                value={editingItem.quantity}
                onChange={(e) =>
                  setEditingItem({
                    ...editingItem,
                    quantity: parseInt(e.target.value),
                  })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Trader Price
              </label>
              <input
                type="number"
                value={editingItem.traderPrice}
                onChange={(e) =>
                  setEditingItem({
                    ...editingItem,
                    traderPrice: parseFloat(e.target.value),
                  })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setEditingItem(null)}
                className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateInventoryItem}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TraderPage;
