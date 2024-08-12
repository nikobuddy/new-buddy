import { addDoc, collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../firebaseConfig"; // Adjust the import according to your file structure

interface CropOffer {
  id: string;
  cropName: string;
  price: number;
  traderName: string;
}

interface TraderPrice {
  id: string;
  cropName: string;
  price: number;
  traderName: string;
}

interface ProductListing {
  id: string;
  productName: string;
  description: string;
  price: number;
  manufacturerName: string;
}

const ManufacturerDashboard: React.FC = () => {
  const [cropOffers, setCropOffers] = useState<CropOffer[]>([]);
  const [productListings, setProductListings] = useState<ProductListing[]>([]);
  const [newPrice, setNewPrice] = useState<Omit<TraderPrice, "id">>({
    cropName: "",
    price: 0,
    traderName: "Trader Name", // Ideally, this should be dynamic based on the logged-in manufacturer
  });

  const [newProduct, setNewProduct] = useState<Omit<ProductListing, "id">>({
    productName: "",
    description: "",
    price: 0,
    manufacturerName: "Manufacturer Name", // Ideally, this should be dynamic based on the logged-in manufacturer
  });

  useEffect(() => {
    const fetchCropOffers = async () => {
      const querySnapshot = await getDocs(collection(db, "cropOffers"));
      const offers = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as CropOffer[];
      setCropOffers(offers);
    };

    const fetchProductListings = async () => {
      const querySnapshot = await getDocs(collection(db, "productListings"));
      const listings = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ProductListing[];
      setProductListings(listings);
    };

    fetchCropOffers();
    fetchProductListings();
  }, []);

  const handleAddPrice = async () => {
    if (newPrice.cropName && newPrice.price > 0) {
      await addDoc(collection(db, "traderPrices"), newPrice);
      setNewPrice({ cropName: "", price: 0, traderName: "Trader Name" });
    }
  };

  const handleAddProduct = async () => {
    if (newProduct.productName && newProduct.price > 0) {
      await addDoc(collection(db, "productListings"), newProduct);
      setNewProduct({
        productName: "",
        description: "",
        price: 0,
        manufacturerName: "Manufacturer Name",
      });
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-10 text-center">
        Manufacturer Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Crop Offers Section */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Crop Offers from Traders
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

        {/* Set Price for Trader's Crop Section */}
        <div className="bg-white shadow-lg rounded-xl p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Set Price for Trader's Crop
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Crop Name
              </label>
              <input
                type="text"
                placeholder="Crop Name"
                value={newPrice.cropName}
                onChange={(e) =>
                  setNewPrice({ ...newPrice, cropName: e.target.value })
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
                value={newPrice.price}
                onChange={(e) =>
                  setNewPrice({
                    ...newPrice,
                    price: parseFloat(e.target.value),
                  })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={handleAddPrice}
              className="w-full bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition"
            >
              Set Price
            </button>
          </div>
        </div>

        {/* Add Product Listing Section */}
        <div className="bg-white shadow-lg rounded-xl p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Add Product Listing
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Product Name
              </label>
              <input
                type="text"
                placeholder="Product Name"
                value={newProduct.productName}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, productName: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Description
              </label>
              <textarea
                placeholder="Product Description"
                value={newProduct.description}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, description: e.target.value })
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
                value={newProduct.price}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    price: parseFloat(e.target.value),
                  })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={handleAddProduct}
              className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition"
            >
              Add Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManufacturerDashboard;
