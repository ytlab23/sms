import { collection, getDocs } from 'firebase/firestore';
import { db } from './../../../firebase/config';

export const fetchAllPricing = async () => {
  try {
    const pricingCollectionRef = collection(db, 'pricing');
    const querySnapshot = await getDocs(pricingCollectionRef);

    const pricingData: { [key: string]: number | null } = {};
    querySnapshot.forEach((doc) => {
      const { price } = doc.data();
      pricingData[doc.id] = price;
    });

    return pricingData;
  } catch (error) {
    console.error('Error fetching pricing data', error);
    return {};
  }
};

export const getServicePrice = (
  serviceName: string,
  countryName: string | null,
  allPricingData: { [key: string]: number | null }
): number | null => {
  if (countryName) {
    const countryServiceKey = `${countryName.toLowerCase()}_${serviceName.toLowerCase()}`;
    return allPricingData[countryServiceKey] ?? null;
  }
  return null;
};