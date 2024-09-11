import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/authcontext';

const TryTo: React.FC = () => {
  const [countries, setCountries] = useState<{ name: string; iso: string; prefix: string }[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [userId, setUserId] = useState<string>('');
  const [products, setProducts] = useState<any[]>([]);
  const [sms, setSms] = useState<any>(null);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedService, setSelectedService] = useState<string>('');
  const { currentUser } = useAuth(); 
//   useEffect(() => {
//     fetchCountries();
//     fetchServices();
//   }, []);

  // Fetch countries
  const fetchCountries = async () => {
    console.log("fetching countries");
    fetch('https://smsverify-server.vercel.app/api/countries', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const formattedCountries = Object.entries(data).map(([key, value]: [string, any]) => ({
          name: value.text_en, // English name of the country
          iso: Object.keys(value.iso)[0], // ISO code, e.g., 'af' for Afghanistan
          prefix: Object.keys(value.prefix)[0], // Prefix, e.g., '+93' for Afghanistan
        }));
        setCountries(formattedCountries);
        console.log("Formatted Countries:", formattedCountries);
      })
      .catch((error) => console.error('Error fetching countries:', error));
  };

  // Fetch services
  // Fetch services
const fetchServices = async () => {
    console.log("fetching services");
    try {
      const response = await axios.get('http://localhost:3000/api/get-services');
      const formattedServices = Object.entries(response.data).map(([key, value]: [string, any]) => ({
        name: key, // Service name like '115com'
        category: (value as { Category: string }).Category, // Service category
        quantity: (value as { Qty: number }).Qty, // Available quantity
        price: (value as { Price: number }).Price, // Service price
      }));
      setServices(formattedServices);
      console.log("Formatted Services:", formattedServices);
    } catch (error) {
      console.error('Failed to fetch services', error);
    }
  };
  

  // Buy a product
  const buyProduct = async () => {
    console.log("buying prgggoduct");
    try {
      const response = await axios.post('http://localhost:3000/api/buy-product', {
        uid: currentUser?.uid,
        country: "E",
        service: "telegram",
      });
      alert('Product purchased successfully');
      console.log(response.data);
    } catch (error) {
      alert('Failed to purchase product');
      console.error(error);
    }
  };

  // Fetch user products
  const fetchUserProducts = async () => {
    console.log("getting user products");
    try {
      const response = await axios.get('http://localhost:3000/api/get-user-products', {
        params: { uid: userId },
      });
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch products', error);
    }
  };

  // Fetch SMS
  const fetchSms = async (numberId: string) => {
    console.log("fetching sms");
    try {
      const response = await axios.get('http://localhost:3000/api/get-sms', {
        params: { uid: userId, numberId },
      });
      setSms(response.data);
    } catch (error) {
      console.error('Failed to fetch SMS', error);
    }
  };

  return (
    <div className="App">
      <h1>5sim Integration Demo</h1>
      <input
        type="text"
        placeholder="User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
      <button onClick={fetchCountries}>Get Countries</button>
      <button onClick={fetchServices}>Get Services</button>
      <button onClick={fetchUserProducts}>Get User Products</button>
      <h2>Countries</h2>
      <select onChange={(e) => setSelectedCountry(e.target.value)}>
        <option value="">Select Country</option>
        {countries.map((country) => (
          <option key={country.iso} value={country.iso}>
            {country.name} ({country.prefix})
          </option>
        ))}
      </select>
      <h2>Services</h2>
<select onChange={(e) => setSelectedService(e.target.value)}>
  <option value="">Select Service</option>
  {services.map((service) => (
    <option key={service.name} value={service.name}>
      {service.name} - {service.category} - {service.quantity} available - ${service.price}
    </option>
  ))}
</select>

      <h2>Purchased Products</h2>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.number} - {product.purchaseDate}
            <button onClick={() => fetchSms(product.id)}>Get SMS</button>
          </li>
        ))}
      </ul>
      {sms && (
        <div>
          <h3>SMS Details</h3>
          <p>{JSON.stringify(sms)}</p>
        </div>
      )}
      <button onClick={buyProduct}>Buy Product</button>
    </div>
    
  );
};

export default TryTo;
