import { addDoc, collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../firebaseConfig"; // Adjust the import according to your file structure

// Define interfaces for the data structures
interface CropForSale {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface CropDemand {
  id: string;
  cropName: string;
  price: number;
  traderName: string;
}

interface CropOffer {
  id: string;
  cropName: string;
  price: number;
  traderName: string;
}

const TraderPage: React.FC = () => {
  const [cropsForSale, setCropsForSale] = useState<CropForSale[]>([]);
  const [newDemand, setNewDemand] = useState<Omit<CropDemand, "id">>({
    cropName: "",
    price: 0,
    traderName: "Trader Name", // Ideally, this should be dynamic based on the logged-in trader
  });
  const [cropDemands, setCropDemands] = useState<CropDemand[]>([]);
  const [newOffer, setNewOffer] = useState<Omit<CropOffer, "id">>({
    cropName: "",
    price: 0,
    traderName: "Trader Name", // Ideally, this should be dynamic based on the logged-in trader
  });
  const [cropOffers, setCropOffers] = useState<CropOffer[]>([]);

  useEffect(() => {
    const fetchCropsForSale = async () => {
      const querySnapshot = await getDocs(collection(db, "cropsForSale"));
      const crops = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as CropForSale[];
      setCropsForSale(crops);
    };

    const fetchCropDemands = async () => {
      const querySnapshot = await getDocs(collection(db, "cropDemands"));
      const demands = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as CropDemand[];
      setCropDemands(demands);
    };

    const fetchCropOffers = async () => {
      const querySnapshot = await getDocs(collection(db, "cropOffers"));
      const offers = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as CropOffer[];
      setCropOffers(offers);
    };

    fetchCropsForSale();
    fetchCropDemands();
    fetchCropOffers();
  }, []);

  // Handle adding a new crop demand
  const handleAddDemand = async () => {
    if (newDemand.cropName && newDemand.price > 0) {
      const docRef = await addDoc(collection(db, "cropDemands"), newDemand);
      setCropDemands([...cropDemands, { id: docRef.id, ...newDemand }]);
      setNewDemand({ cropName: "", price: 0, traderName: "Trader Name" });
    }
  };

  // Handle adding a new crop offer
  const handleAddOffer = async () => {
    if (newOffer.cropName && newOffer.price > 0) {
      const docRef = await addDoc(collection(db, "cropOffers"), newOffer);
      setCropOffers([...cropOffers, { id: docRef.id, ...newOffer }]);
      setNewOffer({ cropName: "", price: 0, traderName: "Trader Name" });
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-10 text-center">
        Trader Dashboard
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Available Crops for Sale */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Available Crops for Sale
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
                {/* Add other functionalities like purchasing or negotiating here */}
              </div>
            ))}
          </div>
        </div>
        {/* Add Crop Demand */}
        <div className="bg-white shadow-lg rounded-xl p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Add Crop Demand
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Crop Name
              </label>
              <input
                type="text"
                placeholder="Crop Name"
                value={newDemand.cropName}
                onChange={(e) =>
                  setNewDemand({ ...newDemand, cropName: e.target.value })
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
                value={newDemand.price}
                onChange={(e) =>
                  setNewDemand({
                    ...newDemand,
                    price: parseFloat(e.target.value),
                  })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={handleAddDemand}
              className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition"
            >
              Add Demand
            </button>
          </div>
        </div>
        {/* Add Crop Offer */}
        <div className="bg-white shadow-lg rounded-xl p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Add Crop Offer to Manufacturer
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Crop Name
              </label>
              <input
                type="text"
                placeholder="Crop Name"
                value={newOffer.cropName}
                onChange={(e) =>
                  setNewOffer({ ...newOffer, cropName: e.target.value })
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
                value={newOffer.price}
                onChange={(e) =>
                  setNewOffer({
                    ...newOffer,
                    price: parseFloat(e.target.value),
                  })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={handleAddOffer}
              className="w-full bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition"
            >
              Add Offer
            </button>
          </div>
        </div>
        {/* Crop Demands */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Crop Demands
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cropDemands.map((demand) => (
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
        </div>
        {/* Crop Offers */} {/* Crop Offers */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Crop Offers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cropOffers.map((offer) => (
              <div
                key={offer.id}
                className="bg-white shadow-md rounded-lg p-6 space-y-2"
              >
                <h3 className="text-xl font-bold text-gray-700">
                  {offer.cropName}
                </h3>
                <p className="text-gray-600">
                  Price: ${offer.price.toFixed(2)}
                </p>
                <p className="text-gray-600">Trader: {offer.traderName}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TraderPage;
